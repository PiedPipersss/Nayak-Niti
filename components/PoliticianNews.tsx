"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, Newspaper, AlertCircle, RefreshCw, Clock, TrendingUp } from 'lucide-react';

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
  constituency?: string;
  state?: string;
  party?: string;
}

const PoliticianNews: React.FC<PoliticianNewsProps> = ({ 
  politicianName, 
  constituency, 
  state, 
  party 
}) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'newsapi' | 'google'>('google');

  useEffect(() => {
    fetchNews();
  }, [politicianName, constituency, state, party]);

  const fetchNews = async (retryWithGoogle = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        name: politicianName,
      });

      if (constituency) params.append('constituency', constituency);
      if (state) params.append('state', state);
      if (party) params.append('party', party);

      const endpoint = retryWithGoogle || source === 'google' 
        ? '/api/news/politician-google' 
        : '/api/news/politician';

      const response = await fetch(`${endpoint}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        setSource(retryWithGoogle || source === 'google' ? 'google' : 'newsapi');
      } else if (!retryWithGoogle && source === 'newsapi') {
        await fetchNews(true);
        return;
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to load news articles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getTimeColor = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'bg-green-100 text-green-700';
    if (diffDays <= 3) return 'bg-cyan-100 text-cyan-700';
    if (diffDays <= 7) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#FF9800]" />
          Recent News & Updates
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-[#ECEFF1]">
              <div className="h-40 bg-gradient-to-br from-[#ECEFF1] to-[#CFD8DC] animate-pulse"></div>
              <CardContent className="pt-4 space-y-3">
                <div className="h-3 bg-[#ECEFF1] rounded animate-pulse"></div>
                <div className="h-3 bg-[#ECEFF1] rounded w-3/4 animate-pulse"></div>
                <div className="h-2 bg-[#ECEFF1] rounded animate-pulse"></div>
                <div className="h-2 bg-[#ECEFF1] rounded w-5/6 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#FF9800]" />
          Recent News & Updates
        </h3>
        
        <Card className="border-[#EF5350]">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[#EF5350]" />
              <h4 className="text-lg font-bold text-[#263238] mb-2">Unable to Load News</h4>
              <p className="text-[#424242] mb-4 text-sm">{error}</p>
              <button
                onClick={() => fetchNews()}
                className="px-4 py-2 bg-[#FF9800] text-white rounded-lg hover:bg-[#F57C00] transition-colors flex items-center gap-2 mx-auto text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#FF9800]" />
          Recent News & Updates
        </h3>
        
        <Card className="border-[#ECEFF1]">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-[#424242] opacity-30" />
              <h4 className="text-lg font-bold text-[#263238] mb-2">No Recent News Found</h4>
              <p className="text-[#424242] text-sm mb-4 max-w-md mx-auto">
                {politicianName} may not have recent media coverage.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Check their performance metrics in the Profile tab.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#263238] flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#FF9800]" />
          Recent News & Updates
        </h3>
        <Badge variant="outline" className="text-xs">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((article, index) => (
          <Card 
            key={index} 
            className="group hover:shadow-lg transition-all duration-300 border-[#ECEFF1] hover:border-[#00BCD4] overflow-hidden flex flex-col h-full"
          >
            {/* Image Section */}
            {article.urlToImage ? (
              <div className="relative h-36 overflow-hidden bg-[#ECEFF1] shrink-0">
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="h-36 bg-gradient-to-br from-[#FF9800]/20 to-[#00BCD4]/20 flex items-center justify-center shrink-0">
                <Newspaper className="w-12 h-12 text-[#424242] opacity-20" />
              </div>
            )}

            <CardContent className="pt-3 pb-4 px-4 flex flex-col flex-1">
              {/* Header with Source and Date */}
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {article.source}
                </Badge>
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${getTimeColor(article.publishedAt)}`}>
                  {formatDate(article.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-semibold text-[#263238] text-sm line-clamp-2 leading-tight group-hover:text-[#00BCD4] transition-colors mb-2">
                {article.title}
              </h4>

              {/* Description */}
              {article.description && (
                <p className="text-xs text-[#424242] line-clamp-2 leading-relaxed mb-3 flex-1">
                  {article.description}
                </p>
              )}

              {/* Read More Link */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#00BCD4] hover:text-[#0097A7] transition-colors font-medium mt-auto"
              >
                Read full article
                <ExternalLink className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-[#424242]">
          News powered by {source === 'google' ? 'Google News' : 'NewsAPI'} • Last updated: {new Date().toLocaleTimeString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default PoliticianNews;