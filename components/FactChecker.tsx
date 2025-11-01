"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  ExternalLink,
  Search,
  BarChart3,
  Info,
  Zap,
  Eye
} from 'lucide-react';

interface FactCheckResult {
  sourceCredibility: any;
  biasAnalysis: any;
  factChecks: any[];
  assessment: any;
}

const FactChecker: React.FC = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);

  const handleCheck = async () => {
    if (!url && !title) {
      alert('Please enter at least a URL or title');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, title, content })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to perform fact check');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#4CAF50]';
    if (score >= 60) return 'text-[#00BCD4]';
    if (score >= 40) return 'text-[#FF9800]';
    return 'text-[#EF5350]';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-cyan-500 to-cyan-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getCredibilityIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <ShieldCheck className="w-6 h-6 text-[#4CAF50]" />;
      case 'Medium':
        return <Shield className="w-6 h-6 text-[#FF9800]" />;
      case 'Low':
        return <ShieldAlert className="w-6 h-6 text-[#EF5350]" />;
      default:
        return <Shield className="w-6 h-6 text-[#424242]" />;
    }
  };

  const getBiasColor = (bias: string) => {
    if (bias.includes('Left')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (bias.includes('Right')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-[#00BCD4] bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BCD4] to-[#0097A7] flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            Bias & Fake News Detector
          </CardTitle>
          <p className="text-sm text-[#424242] mt-2">
            Analyze news articles for credibility, bias, and fact-checked claims using AI and verified databases
          </p>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card className="border-[#ECEFF1]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-[#00BCD4]" />
            Enter Article Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#263238] mb-2 block">
              Article URL (Optional)
            </label>
            <Input
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border-[#ECEFF1] focus:border-[#00BCD4]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#263238] mb-2 block">
              Article Title *
            </label>
            <Input
              placeholder="Enter the headline or main claim"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[#ECEFF1] focus:border-[#00BCD4]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#263238] mb-2 block">
              Article Content (Optional)
            </label>
            <Textarea
              placeholder="Paste article content for deeper analysis..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="border-[#ECEFF1] focus:border-[#00BCD4]"
            />
          </div>

          <Button
            onClick={handleCheck}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7] hover:from-[#0097A7] hover:to-[#00838F] text-white font-semibold py-6"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Analyze Article
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Assessment */}
          <Card className="border-2 border-[#00BCD4] overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${getScoreBgColor(result.assessment.overallScore)}`}></div>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-6xl font-bold ${getScoreColor(result.assessment.overallScore)}`}>
                      {result.assessment.overallScore}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#263238]">{result.assessment.verdict}</h3>
                      <p className="text-sm text-[#424242]">Overall Credibility Score</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Recommendation</p>
                        <p className="text-sm text-blue-800">{result.assessment.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {result.assessment.concerns.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-semibold text-[#263238] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#FF9800]" />
                        Concerns Detected:
                      </p>
                      {result.assessment.concerns.map((concern: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-[#424242] bg-orange-50 p-3 rounded-lg border border-orange-200">
                          <XCircle className="w-4 h-4 text-[#EF5350] mt-0.5 shrink-0" />
                          <span>{concern}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden md:block">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBgColor(result.assessment.overallScore)} flex items-center justify-center shadow-xl`}>
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                      <Eye className="w-12 h-12 text-[#263238]" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source Credibility */}
          {result.sourceCredibility && (
            <Card className="border-[#ECEFF1]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getCredibilityIcon(result.sourceCredibility.credibilityLevel)}
                  Source Credibility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#FAFAFA] rounded-lg p-4">
                    <p className="text-xs text-[#424242] mb-1">Source Domain</p>
                    <p className="font-bold text-[#263238]">{result.sourceCredibility.domain}</p>
                  </div>
                  <div className="bg-[#FAFAFA] rounded-lg p-4">
                    <p className="text-xs text-[#424242] mb-1">Credibility Score</p>
                    <p className={`font-bold text-2xl ${getScoreColor(result.sourceCredibility.credibilityScore)}`}>
                      {result.sourceCredibility.credibilityScore}/100
                    </p>
                  </div>
                  <div className="bg-[#FAFAFA] rounded-lg p-4">
                    <p className="text-xs text-[#424242] mb-1">Political Bias</p>
                    <Badge className={`${getBiasColor(result.sourceCredibility.biasRating)} border text-xs`}>
                      {result.sourceCredibility.biasRating}
                    </Badge>
                  </div>
                  <div className="bg-[#FAFAFA] rounded-lg p-4">
                    <p className="text-xs text-[#424242] mb-1">Factual Reporting</p>
                    <p className="font-bold text-[#263238]">{result.sourceCredibility.factualReporting}</p>
                  </div>
                </div>

                {result.sourceCredibility.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Strengths
                    </p>
                    <ul className="space-y-1">
                      {result.sourceCredibility.strengths.map((strength: string, idx: number) => (
                        <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bias Analysis */}
          <Card className="border-[#ECEFF1]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#FF9800]" />
                Content Bias Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#FAFAFA] rounded-lg p-4">
                  <p className="text-xs text-[#424242] mb-1">Detected Bias</p>
                  <Badge className={`${getBiasColor(result.biasAnalysis.overallBias)} border`}>
                    {result.biasAnalysis.overallBias}
                  </Badge>
                </div>
                <div className="bg-[#FAFAFA] rounded-lg p-4">
                  <p className="text-xs text-[#424242] mb-1">Sentiment</p>
                  <p className="font-bold text-[#263238]">{result.biasAnalysis.sentiment}</p>
                </div>
                <div className="bg-[#FAFAFA] rounded-lg p-4">
                  <p className="text-xs text-[#424242] mb-1">Emotional Language</p>
                  <p className="font-bold text-[#263238]">{result.biasAnalysis.emotionalLanguage.length} instances</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FAFAFA] to-[#ECEFF1] rounded-lg p-4">
                <p className="text-sm font-semibold text-[#263238] mb-3">Content Composition</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#424242]">Factual Statements</span>
                      <span className="font-semibold">{result.biasAnalysis.factualStatements}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4CAF50] to-[#66BB6A]"
                        style={{ width: `${Math.min(100, (result.biasAnalysis.factualStatements / (result.biasAnalysis.factualStatements + result.biasAnalysis.opinionStatements)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#424242]">Opinion Statements</span>
                      <span className="font-semibold">{result.biasAnalysis.opinionStatements}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FF9800] to-[#FFB74D]"
                        style={{ width: `${Math.min(100, (result.biasAnalysis.opinionStatements / (result.biasAnalysis.factualStatements + result.biasAnalysis.opinionStatements)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {result.biasAnalysis.loadedWords.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="font-semibold text-orange-900 mb-2">Emotional/Loaded Words Detected:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.biasAnalysis.loadedWords.map((word: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="bg-white border-orange-300 text-orange-700">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fact Checks */}
          {result.factChecks.length > 0 && (
            <Card className="border-[#ECEFF1]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#00BCD4]" />
                  Related Fact Checks ({result.factChecks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.factChecks.map((factCheck: any, idx: number) => (
                  <div key={idx} className="border border-[#ECEFF1] rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-[#263238] mb-2">{factCheck.claim}</p>
                        <div className="flex items-center gap-2 text-xs text-[#424242] mb-2">
                          <span>By: {factCheck.claimant}</span>
                          {factCheck.claimDate && (
                            <>
                              <span>•</span>
                              <span>{new Date(factCheck.claimDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${
                              factCheck.rating.toLowerCase().includes('false') ? 'bg-red-100 text-red-700 border-red-200' :
                              factCheck.rating.toLowerCase().includes('true') ? 'bg-green-100 text-green-700 border-green-200' :
                              'bg-yellow-100 text-yellow-700 border-yellow-200'
                            } border text-xs`}
                          >
                            {factCheck.rating}
                          </Badge>
                          <span className="text-xs text-[#424242]">by {factCheck.factChecker}</span>
                        </div>
                      </div>
                      <a
                        href={factCheck.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Read
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Info Card */}
      <Card className="border-[#ECEFF1] bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00BCD4] mt-0.5 shrink-0" />
            <div className="text-sm text-[#424242]">
              <p className="font-semibold text-[#263238] mb-2">How it works:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Checks source credibility against verified database</li>
                <li>Analyzes content for bias and emotional language</li>
                <li>Searches Google Fact Check API for related claims</li>
                <li>Provides an overall reliability score and recommendation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactChecker;