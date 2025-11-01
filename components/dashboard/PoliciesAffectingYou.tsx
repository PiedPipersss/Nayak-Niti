"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Lightbulb,
  Filter,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Policy } from '@/types/policy';

interface PoliciesAffectingYouProps {
  topics: string[];
  constituency: string;
}

const PoliciesAffectingYou: React.FC<PoliciesAffectingYouProps> = ({ topics, constituency }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [isLiveData, setIsLiveData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchPolicies();
  }, [topics, constituency]);

  const fetchPolicies = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        topics: topics.join(','),
        constituency,
        ...(forceRefresh && { refresh: 'true' })
      });

      const response = await fetch(`/api/policies?${params.toString()}`);
      const data = await response.json();

      setPolicies(data.policies || []);
      setCategories(data.categories || []);
      setDataSources(data.sources || []);
      setIsLiveData(data.isLiveData || false);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      
      console.log('Policy data loaded:', {
        count: data.policies?.length,
        sources: data.sources,
        isLive: data.isLiveData
      });
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPolicies(true); // pass true to force refresh
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Implemented':
        return <CheckCircle className="w-4 h-4 text-[#4CAF50]" />;
      case 'Passed':
        return <CheckCircle className="w-4 h-4 text-[#00BCD4]" />;
      case 'Under Review':
        return <Clock className="w-4 h-4 text-[#FF9800]" />;
      case 'Proposed':
        return <Lightbulb className="w-4 h-4 text-[#9C27B0]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#424242]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Implemented':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Passed':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'Under Review':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Proposed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'text-[#EF5350]';
      case 'Medium':
        return 'text-[#FF9800]';
      case 'Low':
        return 'text-[#4CAF50]';
      default:
        return 'text-[#424242]';
    }
  };

  const filteredPolicies = selectedCategory === 'all' 
    ? policies 
    : policies.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <Card className="border-[#ECEFF1]">
        <CardHeader>
          <CardTitle className="text-[#263238] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Policies Affecting You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9800]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#ECEFF1] shadow-lg">
      <CardHeader className="border-b border-[#ECEFF1] bg-gradient-to-r from-[#FAFAFA] to-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#263238] flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Policies Affecting You
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {filteredPolicies.length} Relevant {filteredPolicies.length !== 1 ? 'Policies' : 'Policy'}
            </Badge>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-[#ECEFF1] rounded-lg transition-colors"
              title="Refresh policies"
            >
              <RefreshCw className={`w-5 h-5 text-[#424242] ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <p className="text-sm text-[#424242] mt-2">
          Based on your interests: <span className="font-semibold text-[#00BCD4]">{topics.join(', ')}</span>
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#424242]" />
            <span className="text-sm font-semibold text-[#263238]">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#00BCD4] text-white shadow-md'
                  : 'bg-[#FAFAFA] text-[#424242] hover:bg-[#ECEFF1]'
              }`}
            >
              All ({policies.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-[#00BCD4] text-white shadow-md'
                    : 'bg-[#FAFAFA] text-[#424242] hover:bg-[#ECEFF1]'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Policies List */}
        <div className="space-y-4">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy) => (
              <Card 
                key={policy.id} 
                className="border-[#ECEFF1] hover:shadow-lg transition-all duration-300 hover:border-[#00BCD4] group"
              >
                <CardContent className="pt-5 pb-5">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#263238] text-base leading-tight group-hover:text-[#00BCD4] transition-colors">
                          {policy.title}
                        </h4>
                        <p className="text-xs text-[#424242] mt-1">
                          {policy.source} • Updated {new Date(policy.lastUpdated).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`text-xs border ${getStatusColor(policy.status)} flex items-center gap-1`}>
                          {getStatusIcon(policy.status)}
                          {policy.status}
                        </Badge>
                        {policy.relevanceScore && policy.relevanceScore > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {policy.relevanceScore.toFixed(0)}% Match
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#424242] leading-relaxed">
                      {policy.description}
                    </p>

                    {/* Key Points */}
                    <div className="bg-gradient-to-r from-[#FAFAFA] to-[#ECEFF1] rounded-lg p-3">
                      <p className="text-xs font-semibold text-[#263238] mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-[#FF9800]" />
                        Key Highlights:
                      </p>
                      <ul className="space-y-1">
                        {policy.keyPoints.slice(0, 3).map((point, idx) => (
                          <li key={idx} className="text-xs text-[#424242] flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 text-[#00BCD4] mt-0.5 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#ECEFF1]">
                      <div className="flex flex-wrap gap-1">
                        {policy.affectedSectors.slice(0, 3).map((sector, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold ${getImpactColor(policy.impact)}`}>
                          {policy.impact} Impact
                        </span>
                        <a
                          href={policy.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#00BCD4] hover:text-[#0097A7] font-medium flex items-center gap-1"
                        >
                          Learn More
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-[#424242] opacity-30" />
              <p className="text-[#424242] text-lg">No policies found in this category</p>
              <p className="text-sm text-[#424242] mt-2">Try selecting a different category</p>
            </div>
          )}
        </div>

        {/* Data Source Info */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FAFAFA] to-[#ECEFF1] rounded-lg border border-[#ECEFF1]">
            <div className={`w-2 h-2 rounded-full ${isLiveData ? 'bg-[#4CAF50] animate-pulse' : 'bg-[#FF9800]'}`}></div>
            <p className="text-xs text-[#424242] font-medium">
              {isLiveData ? '🔴 Live Data' : '📦 Cached Data'} from {dataSources.join(', ')} • 
              Updated: {new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoliciesAffectingYou;