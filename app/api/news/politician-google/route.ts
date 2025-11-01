import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const politicianName = searchParams.get('name');
  const constituency = searchParams.get('constituency');
  const state = searchParams.get('state');
  const party = searchParams.get('party');

  if (!politicianName) {
    return NextResponse.json({ error: 'Politician name is required' }, { status: 400 });
  }

  try {
    // Build search queries with fallbacks
    const searchQueries = [
      `${politicianName} India politics`,
      constituency ? `${politicianName} ${constituency}` : null,
      party ? `${politicianName} ${party}` : null,
      state ? `${politicianName} ${state} MP MLA` : null,
    ].filter(Boolean);

    const allArticles: any[] = [];

    for (const query of searchQueries) {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query!)}&hl=en-IN&gl=IN&ceid=IN:en`;
      
      try {
        const response = await fetch(rssUrl);
        const xmlText = await response.text();
        
        // Parse RSS XML
        const items = parseRSS(xmlText);
        allArticles.push(...items);
        
        if (allArticles.length >= 6) break;
      } catch (err) {
        console.error(`Failed to fetch: ${query}`, err);
        continue;
      }
    }

    // Remove duplicates
    const uniqueArticles = Array.from(
      new Map(allArticles.map(article => [article.url, article])).values()
    );

    const articles = uniqueArticles.slice(0, 6);

    return NextResponse.json({ 
      articles,
      totalFound: uniqueArticles.length 
    });
  } catch (error) {
    console.error('Error fetching Google News:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}

function parseRSS(xmlText: string) {
  const items: any[] = [];
  
  // Simple XML parsing for RSS items
  const itemRegex = /<item>(.*?)<\/item>/gs;
  const matches = xmlText.matchAll(itemRegex);
  
  for (const match of matches) {
    const itemXml = match[1];
    
    const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || 
                  itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
    
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
    
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    
    const description = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || 
                       itemXml.match(/<description>(.*?)<\/description>/)?.[1] || '';
    
    const source = itemXml.match(/<source.*?>(.*?)<\/source>/)?.[1] || 'Google News';
    
    if (title && link) {
      items.push({
        title: title.trim(),
        description: description.replace(/<[^>]*>/g, '').trim(),
        url: link.trim(),
        source: source.trim(),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        urlToImage: null,
      });
    }
  }
  
  return items;
}