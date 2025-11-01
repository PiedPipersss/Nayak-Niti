import axios from 'axios';

export interface FactCheckResult {
  claim: string;
  claimant: string;
  claimDate: string;
  rating: string;
  factChecker: string;
  url: string;
  languageCode: string;
}

export interface SourceCredibility {
  domain: string;
  credibilityScore: number;
  biasRating: 'Left' | 'Center-Left' | 'Center' | 'Center-Right' | 'Right' | 'Unknown';
  factualReporting: 'Very High' | 'High' | 'Mostly Factual' | 'Mixed' | 'Low' | 'Very Low';
  credibilityLevel: 'High' | 'Medium' | 'Low' | 'Unknown';
  warnings: string[];
  strengths: string[];
}

export interface BiasAnalysis {
  overallBias: string;
  biasScore: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore: number;
  emotionalLanguage: string[];
  factualStatements: number;
  opinionStatements: number;
  loadedWords: string[];
  clickbaitScore: number;
  sensationalismScore: number;
  redFlags: string[];
}

// Expanded fake news indicators
const FAKE_NEWS_INDICATORS = {
  clickbaitPhrases: [
    'you won\'t believe', 'shocking', 'this will blow your mind',
    'what happened next', 'doctors hate', 'they don\'t want you to know',
    'the truth about', 'exposed', 'revealed', 'secret',
    'breaking:', 'urgent:', 'alert:', 'warning:',
    'miracle', 'unbelievable', 'incredible', 'amazing discovery'
  ],
  
  sensationalWords: [
    'devastating', 'catastrophic', 'unprecedented', 'crisis',
    'disaster', 'bombshell', 'explosive', 'scandal',
    'outrage', 'fury', 'slammed', 'blasted', 'destroyed',
    'annihilated', 'obliterated', 'terrifying', 'horrifying'
  ],

  vagueTerms: [
    'some people say', 'many believe', 'sources claim',
    'it is believed', 'allegedly', 'reportedly',
    'according to sources', 'insiders say', 'experts claim',
    'studies show' // without citing specific studies
  ],

  extremeLanguage: [
    'always', 'never', 'everyone', 'nobody', 'all',
    'none', 'completely', 'totally', 'absolutely',
    'definitely', 'certainly', '100%', 'guaranteed'
  ],

  manipulativeWords: [
    'wake up', 'sheeple', 'they want you to believe',
    'mainstream media won\'t tell you', 'censored',
    'banned', 'forbidden', 'hidden truth', 'cover-up'
  ],

  unverifiableStats: [
    'some say', 'many people', 'a lot of', 'countless',
    'numerous studies', 'research shows', // without citation
  ]
};

// Expanded source credibility database
const sourceCredibilityDB: { [key: string]: SourceCredibility } = {
  // High Credibility - Established News
  'thehindu.com': {
    domain: 'thehindu.com',
    credibilityScore: 92,
    biasRating: 'Center-Left',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['Pulitzer Prize winning', 'Fact-checking department', '145+ years history', 'Transparent corrections policy']
  },
  'indianexpress.com': {
    domain: 'indianexpress.com',
    credibilityScore: 90,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['Strong investigative team', 'Multiple source verification', 'Editorial independence']
  },
  'reuters.com': {
    domain: 'reuters.com',
    credibilityScore: 95,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['International wire service', 'Strict editorial standards', 'Fact-based reporting']
  },
  'bbc.com': {
    domain: 'bbc.com',
    credibilityScore: 93,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['Public broadcaster', 'Global presence', 'Editorial guidelines']
  },

  // Medium Credibility
  'timesofindia.indiatimes.com': {
    domain: 'timesofindia.indiatimes.com',
    credibilityScore: 72,
    biasRating: 'Center',
    factualReporting: 'High',
    credibilityLevel: 'Medium',
    warnings: ['Sensational headlines occasionally', 'Opinion mixed with news'],
    strengths: ['Wide reach', 'Quick updates']
  },
  'hindustantimes.com': {
    domain: 'hindustantimes.com',
    credibilityScore: 78,
    biasRating: 'Center',
    factualReporting: 'High',
    credibilityLevel: 'Medium',
    warnings: ['Some clickbait headlines'],
    strengths: ['Regional coverage', 'Established brand']
  },
  'ndtv.com': {
    domain: 'ndtv.com',
    credibilityScore: 85,
    biasRating: 'Center-Left',
    factualReporting: 'High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['Live reporting', 'Video journalism', 'Fact-checking unit']
  },

  // Fact-Checking Organizations
  'altnews.in': {
    domain: 'altnews.in',
    credibilityScore: 95,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['IFCN certified', 'Dedicated fact-checking', 'Source verification', 'Debunking expertise']
  },
  'boomlive.in': {
    domain: 'boomlive.in',
    credibilityScore: 94,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['IFCN signatory', 'Multimedia verification', 'Transparent methodology']
  },
  'factcheck.org': {
    domain: 'factcheck.org',
    credibilityScore: 96,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['Non-partisan', 'University-backed', 'Detailed analysis']
  },
  'snopes.com': {
    domain: 'snopes.com',
    credibilityScore: 93,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: [],
    strengths: ['Oldest fact-checking site', 'Comprehensive database', 'Detailed explanations']
  },

  // Government/Official Sources
  'pib.gov.in': {
    domain: 'pib.gov.in',
    credibilityScore: 90,
    biasRating: 'Center',
    factualReporting: 'Very High',
    credibilityLevel: 'High',
    warnings: ['Official government source - may lack critical perspective'],
    strengths: ['Primary source', 'Official announcements', 'Press releases']
  },

  // Low Credibility / Questionable
  'opindia.com': {
    domain: 'opindia.com',
    credibilityScore: 35,
    biasRating: 'Right',
    factualReporting: 'Low',
    credibilityLevel: 'Low',
    warnings: ['Strong political bias', 'Failed fact-checks', 'Misleading headlines', 'Opinion as news'],
    strengths: []
  },
  'postcard.news': {
    domain: 'postcard.news',
    credibilityScore: 25,
    biasRating: 'Right',
    factualReporting: 'Very Low',
    credibilityLevel: 'Low',
    warnings: ['Known for misinformation', 'Extreme bias', 'Conspiracy theories', 'No editorial standards'],
    strengths: []
  },
  'tfipost.com': {
    domain: 'tfipost.com',
    credibilityScore: 30,
    biasRating: 'Right',
    factualReporting: 'Low',
    credibilityLevel: 'Low',
    warnings: ['Questionable sourcing', 'Strong bias', 'Sensationalism'],
    strengths: []
  },
  'swarajyamag.com': {
    domain: 'swarajyamag.com',
    credibilityScore: 55,
    biasRating: 'Right',
    factualReporting: 'Mixed',
    credibilityLevel: 'Medium',
    warnings: ['Strong right-wing bias', 'Opinion-heavy'],
    strengths: ['Some original reporting']
  },

  // Social Media / Unverified
  'facebook.com': {
    domain: 'facebook.com',
    credibilityScore: 20,
    biasRating: 'Unknown',
    factualReporting: 'Very Low',
    credibilityLevel: 'Low',
    warnings: ['Social media platform', 'Unverified user content', 'High misinformation risk', 'Not a news source'],
    strengths: []
  },
  'twitter.com': {
    domain: 'twitter.com',
    credibilityScore: 25,
    biasRating: 'Unknown',
    factualReporting: 'Very Low',
    credibilityLevel: 'Low',
    warnings: ['Social media platform', 'Unverified posts', 'Viral misinformation', 'Not a news source'],
    strengths: ['Real-time updates', 'Primary sources sometimes available']
  },
  'whatsapp.com': {
    domain: 'whatsapp.com',
    credibilityScore: 10,
    biasRating: 'Unknown',
    factualReporting: 'Very Low',
    credibilityLevel: 'Low',
    warnings: ['Messaging app', 'Major source of fake news in India', 'No verification', 'Viral forwards'],
    strengths: []
  }
};

export function getSourceCredibility(url: string): SourceCredibility {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Check exact match
    if (sourceCredibilityDB[domain]) {
      return sourceCredibilityDB[domain];
    }

    // Check partial match
    for (const [key, value] of Object.entries(sourceCredibilityDB)) {
      if (domain.includes(key) || key.includes(domain)) {
        return value;
      }
    }

    // Check for social media domains
    if (domain.includes('facebook') || domain.includes('fb.com')) {
      return sourceCredibilityDB['facebook.com'];
    }
    if (domain.includes('twitter') || domain.includes('x.com')) {
      return sourceCredibilityDB['twitter.com'];
    }
    if (domain.includes('whatsapp') || domain.includes('wa.me')) {
      return sourceCredibilityDB['whatsapp.com'];
    }

    // Unknown source - be very cautious
    return {
      domain: domain,
      credibilityScore: 40,
      biasRating: 'Unknown',
      factualReporting: 'Mixed',
      credibilityLevel: 'Unknown',
      warnings: [
        'Unverified news source',
        'No established track record',
        'Cannot verify editorial standards',
        'Cross-check with known reliable sources'
      ],
      strengths: []
    };
  } catch (error) {
    return {
      domain: 'Invalid URL',
      credibilityScore: 0,
      biasRating: 'Unknown',
      factualReporting: 'Very Low',
      credibilityLevel: 'Low',
      warnings: ['Invalid URL provided'],
      strengths: []
    };
  }
}

export function analyzeBias(text: string): BiasAnalysis {
  const lowerText = text.toLowerCase();
  const redFlags: string[] = [];

  // Clickbait detection
  let clickbaitScore = 0;
  FAKE_NEWS_INDICATORS.clickbaitPhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      clickbaitScore += 20;
      redFlags.push(`Clickbait phrase detected: "${phrase}"`);
    }
  });

  // Sensationalism detection
  let sensationalismScore = 0;
  const foundSensational: string[] = [];
  FAKE_NEWS_INDICATORS.sensationalWords.forEach(word => {
    if (lowerText.includes(word)) {
      sensationalismScore += 10;
      foundSensational.push(word);
    }
  });
  if (sensationalismScore > 30) {
    redFlags.push('Excessive sensational language detected');
  }

  // Vague sourcing detection
  let vagueSourceCount = 0;
  FAKE_NEWS_INDICATORS.vagueTerms.forEach(term => {
    if (lowerText.includes(term)) {
      vagueSourceCount++;
      redFlags.push(`Vague sourcing: "${term}"`);
    }
  });

  // Extreme language detection
  let extremeLanguageCount = 0;
  FAKE_NEWS_INDICATORS.extremeLanguage.forEach(word => {
    if (lowerText.includes(word)) {
      extremeLanguageCount++;
    }
  });
  if (extremeLanguageCount > 5) {
    redFlags.push('Excessive use of absolute/extreme language');
  }

  // Manipulative language
  FAKE_NEWS_INDICATORS.manipulativeWords.forEach(word => {
    if (lowerText.includes(word)) {
      redFlags.push(`Manipulative language: "${word}"`);
    }
  });

  // ALL CAPS detection (shouting)
  const capsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
  if (capsWords.length > 3) {
    redFlags.push('Excessive capitalization (shouting)');
  }

  // Excessive punctuation
  const excessivePunctuation = text.match(/[!?]{2,}/g) || [];
  if (excessivePunctuation.length > 2) {
    redFlags.push('Excessive punctuation (!!!, ???)');
  }

  // Political bias detection
  const leftBiasWords = ['progressive', 'equality', 'social justice', 'inclusive', 'welfare', 'rights', 'discrimination', 'liberal'];
  const rightBiasWords = ['traditional', 'conservative', 'national security', 'law and order', 'patriotic', 'nationalist', 'anti-national'];
  
  let biasScore = 0;
  leftBiasWords.forEach(word => {
    if (lowerText.includes(word)) biasScore -= 15;
  });
  rightBiasWords.forEach(word => {
    if (lowerText.includes(word)) biasScore += 15;
  });

  biasScore = Math.max(-100, Math.min(100, biasScore));

  let overallBias = 'Center';
  if (biasScore < -40) overallBias = 'Strong Left bias';
  else if (biasScore > 40) overallBias = 'Strong Right bias';
  else if (biasScore < -20) overallBias = 'Left-leaning';
  else if (biasScore > 20) overallBias = 'Right-leaning';
  else if (biasScore < -5) overallBias = 'Center-Left';
  else if (biasScore > 5) overallBias = 'Center-Right';

  // Sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'success', 'achievement', 'positive', 'beneficial', 'wonderful'];
  const negativeWords = ['bad', 'poor', 'failure', 'negative', 'harmful', 'corrupt', 'scandal', 'terrible', 'awful'];

  let sentimentScore = 0;
  positiveWords.forEach(word => {
    const matches = lowerText.split(word).length - 1;
    sentimentScore += matches * 10;
  });
  negativeWords.forEach(word => {
    const matches = lowerText.split(word).length - 1;
    sentimentScore -= matches * 10;
  });

  let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
  if (sentimentScore > 25) sentiment = 'Positive';
  else if (sentimentScore < -25) sentiment = 'Negative';

  // Factual vs Opinion detection
  const factualIndicators = [
    'according to', 'data shows', 'study found', 'research indicates',
    'statistics reveal', 'survey shows', 'report states', 'analysis reveals',
    'the data', 'measurements show', 'figures indicate'
  ];
  const opinionIndicators = [
    'i think', 'i believe', 'in my opinion', 'it seems', 'appears to be',
    'should', 'must', 'clearly', 'obviously', 'definitely'
  ];

  let factualStatements = 0;
  let opinionStatements = 0;

  factualIndicators.forEach(indicator => {
    const matches = lowerText.split(indicator).length - 1;
    factualStatements += matches;
  });

  opinionIndicators.forEach(indicator => {
    const matches = lowerText.split(indicator).length - 1;
    opinionStatements += matches;
  });

  // If mostly opinion, flag it
  if (opinionStatements > factualStatements * 2 && opinionStatements > 3) {
    redFlags.push('Content is heavily opinion-based rather than factual');
  }

  // Check for lack of sources
  const hasProperCitation = lowerText.includes('according to') || 
                           lowerText.includes('source:') ||
                           lowerText.includes('cited') ||
                           lowerText.includes('reported by');
  
  if (!hasProperCitation && text.length > 200) {
    redFlags.push('No clear sources or citations provided');
  }

  return {
    overallBias,
    biasScore,
    sentiment,
    sentimentScore,
    emotionalLanguage: foundSensational.slice(0, 10),
    factualStatements: Math.max(1, factualStatements),
    opinionStatements,
    loadedWords: foundSensational,
    clickbaitScore: Math.min(100, clickbaitScore),
    sensationalismScore: Math.min(100, sensationalismScore),
    redFlags
  };
}

export async function checkFactsWithGoogle(query: string): Promise<FactCheckResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FACT_CHECK_API_KEY || process.env.GOOGLE_FACT_CHECK_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Fact Check API key not configured');
    return [];
  }

  try {
    const response = await axios.get(
      `https://factchecktools.googleapis.com/v1alpha1/claims:search`,
      {
        params: {
          query: query,
          languageCode: 'en',
          key: apiKey
        },
        timeout: 10000
      }
    );

    if (response.data.claims) {
      return response.data.claims.map((claim: any) => ({
        claim: claim.text || '',
        claimant: claim.claimant || 'Unknown',
        claimDate: claim.claimDate || '',
        rating: claim.claimReview?.[0]?.textualRating || 'Not Rated',
        factChecker: claim.claimReview?.[0]?.publisher?.name || 'Unknown',
        url: claim.claimReview?.[0]?.url || '',
        languageCode: claim.languageCode || 'en'
      }));
    }

    return [];
  } catch (error) {
    console.error('Error checking facts with Google:', error);
    return [];
  }
}