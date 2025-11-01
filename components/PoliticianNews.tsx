"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string;
}

interface PoliticianNewsProps {
  politicianName: string;
}

const PoliticianNews: React.FC<PoliticianNewsProps> = ({ politicianName }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/politician?name=${encodeURIComponent(politicianName)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Unable to load news articles');
      } finally {
        setLoading(false);
      }
    };

    if (politicianName) {
      fetchNews();
    }
  }, [politicianName]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Recent News
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9800]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Recent News
        </h3>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[#424242] text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Recent News
        </h3>
        <Card>
          <CardContent className="pt-6">
            <p className="text-[#424242] text-center">No recent news articles found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
        <Newspaper className="w-5 h-5" />
        Recent News
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((article, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-[#ECEFF1]">
            <CardContent className="pt-6">
              {article.urlToImage && (
                <div className="mb-4 rounded-lg overflow-hidden h-40 bg-[#ECEFF1]">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {article.source}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-[#424242]">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                <h4 className="font-semibold text-[#263238] line-clamp-2 leading-tight">
                  {article.title}
                </h4>

                {article.description && (
                  <p className="text-sm text-[#424242] line-clamp-3">
                    {article.description}
                  </p>
                )}

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#00BCD4] hover:text-[#0097A7] transition-colors"
                >
                  Read full article
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-[#424242]">
          News powered by NewsAPI • Last updated: {new Date().toLocaleTimeString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default PoliticianNews;