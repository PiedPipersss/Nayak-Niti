import axios from 'axios';
import Parser from 'rss-parser';

const rssParser = new Parser({
  customFields: {
    item: ['description', 'content', 'content:encoded']
  }
});

interface ScrapedPolicy {
  title: string;
  description: string;
  category: string;
  status: string;
  dateIntroduced: string;
  source: string;
  sourceUrl: string;
  impact: string;
  affectedSectors: string[];
  keyPoints: string[];
}

// Use PIB Press Releases (Most Reliable)
export async function fetchPIBReleases(): Promise<ScrapedPolicy[]> {
  try {
    console.log('Fetching PIB releases...');
    
    // PIB provides RSS feeds by ministry
    const feeds = [
      'https://pib.gov.in/RssMain.aspx?ModId=3&Lang=1', // All releases
    ];

    const policies: ScrapedPolicy[] = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await rssParser.parseURL(feedUrl);
        console.log(`PIB feed fetched: ${feed.items.length} items`);

        feed.items.slice(0, 20).forEach(item => {
          if (item.title && isPolicyRelated(item.title)) {
            const description = item.contentSnippet || item.content || item.description || '';
            
            policies.push({
              title: cleanTitle(item.title),
              description: cleanDescription(description),
              category: categorizePolicy(item.title + ' ' + description),
              status: 'Announced',
              dateIntroduced: item.pubDate 
                ? new Date(item.pubDate).toISOString().split('T')[0] 
                : new Date().toISOString().split('T')[0],
              source: 'Press Information Bureau (PIB)',
              sourceUrl: item.link || 'https://pib.gov.in',
              impact: determineImpact(item.title + ' ' + description),
              affectedSectors: extractSectors(item.title + ' ' + description),
              keyPoints: extractKeyPoints(description)
            });
          }
        });
      } catch (err) {
        console.error('Error fetching PIB feed:', err);
      }
    }

    console.log(`PIB: Extracted ${policies.length} policy-related items`);
    return policies;
  } catch (error) {
    console.error('Error in fetchPIBReleases:', error);
    return [];
  }
}

// Fetch from India.gov.in News
export async function fetchIndiaGovNews(): Promise<ScrapedPolicy[]> {
  try {
    console.log('Fetching India.gov news...');
    
    const response = await axios.get('https://www.india.gov.in/rss-feeds/latest-news', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const feed = await rssParser.parseString(response.data);
    console.log(`India.gov feed fetched: ${feed.items.length} items`);

    const policies: ScrapedPolicy[] = [];

    feed.items.slice(0, 15).forEach(item => {
      if (item.title && isPolicyRelated(item.title)) {
        const description = item.contentSnippet || item.content || item.description || '';
        
        policies.push({
          title: cleanTitle(item.title),
          description: cleanDescription(description),
          category: categorizePolicy(item.title + ' ' + description),
          status: 'Under Review',
          dateIntroduced: item.pubDate 
            ? new Date(item.pubDate).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0],
          source: 'India.gov.in',
          sourceUrl: item.link || 'https://www.india.gov.in',
          impact: determineImpact(item.title + ' ' + description),
          affectedSectors: extractSectors(item.title + ' ' + description),
          keyPoints: extractKeyPoints(description)
        });
      }
    });

    console.log(`India.gov: Extracted ${policies.length} policy-related items`);
    return policies;
  } catch (error) {
    console.error('Error in fetchIndiaGovNews:', error);
    return [];
  }
}

// Fetch from Ministry of Finance
export async function fetchFinanceMinistryNews(): Promise<ScrapedPolicy[]> {
  try {
    console.log('Fetching Finance Ministry news...');
    
    const feed = await rssParser.parseURL('https://www.finmin.nic.in/rss/whatsnew');
    console.log(`Finance Ministry feed fetched: ${feed.items.length} items`);

    const policies: ScrapedPolicy[] = [];

    feed.items.slice(0, 10).forEach(item => {
      if (item.title) {
        const description = item.contentSnippet || item.content || item.description || '';
        
        policies.push({
          title: cleanTitle(item.title),
          description: cleanDescription(description) || 'Financial policy and economic measures by the Ministry of Finance',
          category: 'Economy',
          status: 'Implemented',
          dateIntroduced: item.pubDate 
            ? new Date(item.pubDate).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0],
          source: 'Ministry of Finance',
          sourceUrl: item.link || 'https://www.finmin.nic.in',
          impact: 'High',
          affectedSectors: ['Economy', 'Finance', 'Business'],
          keyPoints: extractKeyPoints(description) 
        });
      }
    });

    console.log(`Finance Ministry: Extracted ${policies.length} items`);
    return policies;
  } catch (error) {
    console.error('Error in fetchFinanceMinistryNews:', error);
    return [];
  }
}

// Helper Functions
function cleanTitle(title: string): string {
  return title
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanDescription(description: string): string {
  if (!description) return '';
  
  return description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 500); // Limit length
}

function isPolicyRelated(text: string): boolean {
  const policyKeywords = [
    'scheme', 'policy', 'initiative', 'programme', 'mission',
    'bill', 'act', 'amendment', 'cabinet', 'government',
    'launch', 'approve', 'announce', 'implement', 'yojana',
    'subsidy', 'fund', 'budget', 'allocation', 'welfare'
  ];

  const lowerText = text.toLowerCase();
  return policyKeywords.some(keyword => lowerText.includes(keyword));
}

function categorizePolicy(text: string): string {
  const lowerText = text.toLowerCase();
  
  const categories: { [key: string]: string[] } = {
    'Education': ['education', 'school', 'university', 'student', 'teacher', 'learning'],
    'Healthcare': ['health', 'medical', 'hospital', 'doctor', 'ayushman', 'treatment'],
    'Agriculture': ['agriculture', 'farmer', 'crop', 'kisan', 'farming', 'rural'],
    'Technology': ['technology', 'digital', 'internet', 'cyber', 'ai', 'tech'],
    'Environment': ['environment', 'climate', 'pollution', 'green', 'renewable', 'solar'],
    'Business': ['business', 'startup', 'industry', 'commerce', 'msme', 'trade'],
    'Economy': ['economy', 'finance', 'tax', 'budget', 'economic', 'fiscal'],
    'Social Welfare': ['welfare', 'women', 'child', 'pension', 'disability', 'senior'],
    'Infrastructure': ['infrastructure', 'road', 'highway', 'railway', 'metro', 'construction'],
    'Employment': ['employment', 'job', 'skill', 'training', 'rozgar', 'career']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return 'General';
}

function determineImpact(text: string): string {
  const lowerText = text.toLowerCase();
  
  const highImpactKeywords = ['crore', 'billion', 'national', 'major', 'landmark', 'revolutionary'];
  const mediumImpactKeywords = ['lakh', 'million', 'regional', 'significant'];
  
  if (highImpactKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'High';
  } else if (mediumImpactKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'Medium';
  }
  
  return 'Low';
}

function extractSectors(text: string): string[] {
  const sectors: string[] = [];
  const lowerText = text.toLowerCase();
  
  const sectorMap: { [key: string]: string[] } = {
    'Education': ['education', 'school', 'university'],
    'Healthcare': ['health', 'medical', 'hospital'],
    'Agriculture': ['agriculture', 'farmer', 'crop'],
    'Technology': ['technology', 'digital', 'internet'],
    'Environment': ['environment', 'climate', 'green'],
    'Economy': ['economy', 'finance', 'tax'],
    'Employment': ['employment', 'job', 'skill'],
    'Infrastructure': ['infrastructure', 'road', 'transport'],
  };
  
  for (const [sector, keywords] of Object.entries(sectorMap)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      sectors.push(sector);
    }
  }
  
  return sectors.length > 0 ? sectors : ['General'];
}

function extractKeyPoints(text: string): string[] {
  if (!text || text.length < 30) {
    return [
      'Official details available on government portal',
      'Implementation timeline to be announced',
      'Public consultation in progress'
    ];
  }

  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 25 && s.length < 200);

  if (sentences.length >= 3) {
    return sentences.slice(0, 4);
  }

  // Fallback: split by semicolons or commas
  const points = text
    .split(/[;,]/)
    .map(s => s.trim())
    .filter(s => s.length > 25 && s.length < 200);

  if (points.length >= 2) {
    return points.slice(0, 4);
  }

  return [
    text.substring(0, 150) + '...',
    'More details available on official website',
    'Implementation being monitored by respective ministry'
  ];
}