import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const politicianName = searchParams.get('name');

  if (!politicianName) {
    return NextResponse.json({ error: 'Politician name is required' }, { status: 400 });
  }

  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'NewsAPI key not configured' }, { status: 500 });
  }

  try {
    // Search for news articles about the politician
    const response = await fetch(
      `https://newsapi.org/v2/everything?q="${politicianName}" India politics&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();

    // Filter and format articles
    const articles = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
    }));

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}