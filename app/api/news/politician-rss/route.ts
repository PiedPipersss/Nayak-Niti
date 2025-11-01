import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const politicianName = searchParams.get('name');

  if (!politicianName) {
    return NextResponse.json({ error: 'Politician name is required' }, { status: 400 });
  }

  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(politicianName + ' India politics')}&hl=en-IN&gl=IN&ceid=IN:en`;
    
    const feed = await parser.parseURL(rssUrl);

    const articles = feed.items.slice(0, 6).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.content || '',
      url: item.link || '',
      source: item.source?.title || 'Google News',
      publishedAt: item.pubDate || new Date().toISOString(),
      urlToImage: null,
    }));

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching RSS news:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}