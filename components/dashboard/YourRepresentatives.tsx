"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MapPin, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Politician } from '@/types/politician';
import Papa from 'papaparse';

interface YourRepresentativesProps {
  constituency: string;
  state: string;
}

interface PerformanceMetrics {
  debates: number;
  questions: number;
  bills: number;
  attendance: number;
}

interface Averages {
  national: PerformanceMetrics;
  state: PerformanceMetrics;
}

const YourRepresentatives: React.FC<YourRepresentativesProps> = ({ constituency, state }) => {
  const [lokSabhaMP, setLokSabhaMP] = useState<Politician | null>(null);
  const [rajyaSabhaMP, setRajyaSabhaMP] = useState<Politician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepresentatives = async () => {
      try {
        // Load Lok Sabha data
        const lokSabhaResponse = await fetch('/PoliticiansData/18 LS MP Track.csv');
        const lokSabhaText = await lokSabhaResponse.text();
        const lokSabhaParsed = Papa.parse(lokSabhaText, { header: true });
        
        // Find MP matching constituency
        const matchedMP = (lokSabhaParsed.data as Politician[]).find(
          (mp) => 
            mp.mp_name && 
            mp.pc_name && 
            mp.pc_name.toLowerCase().includes(constituency.toLowerCase())
        );

        setLokSabhaMP(matchedMP || null);

        // Load Rajya Sabha data
        const rajyaSabhaResponse = await fetch('/PoliticiansData/RS MP Track.csv');
        const rajyaSabhaText = await rajyaSabhaResponse.text();
        const rajyaSabhaParsed = Papa.parse(rajyaSabhaText, { header: true });

        // Find Rajya Sabha MP from the same state
        const stateMP = (rajyaSabhaParsed.data as Politician[]).find(
          (mp) => 
            mp.mp_name && 
            mp.state && 
            mp.state.toLowerCase() === state.toLowerCase()
        );

        setRajyaSabhaMP(stateMP || null);
      } catch (error) {
        console.error('Error loading representatives:', error);
      } finally {
        setLoading(false);
      }
    };

    if (constituency && state) {
      loadRepresentatives();
    }
  }, [constituency, state]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAttendanceColor = (attendance: string) => {
    if (!attendance || attendance === 'N/A') return 'text-[#424242]';
    const percent = parseFloat(attendance) * 100;
    if (percent >= 80) return 'text-[#4CAF50]';
    if (percent >= 60) return 'text-[#FF9800]';
    return 'text-[#EF5350]';
  };

  const formatAttendance = (attendance: string) => {
    if (!attendance) return 'N/A';
    return (parseFloat(attendance) * 100).toFixed(1) + '%';
  };

  const getPerformanceMetrics = (mp: Politician): PerformanceMetrics => {
    return {
      debates: parseFloat(mp.debates || mp.ag_debates || '0'),
      questions: parseFloat(mp.questions || mp.ag_questions || '0'),
      bills: parseFloat(mp.private_member_bills || mp.ag_private_member_bills || '0'),
      attendance: parseFloat(mp.attendance || mp.avg_attendance || '0') * 100,
    };
  };

  const getNationalAverages = (mp: Politician): PerformanceMetrics => {
    return {
      debates: parseFloat(mp.national_average_debate || mp.ag_national_average_debate || '0'),
      questions: parseFloat(mp.national_average_questions || mp.ag_national_average_questions || '0'),
      bills: parseFloat(mp.national_average_pmb || mp.ag_national_average_pmb || '0'),
      attendance: parseFloat(mp.attendance_national_average || mp.avg_attendance_national_average || '0') * 100,
    };
  };

  const getStateAverages = (mp: Politician): PerformanceMetrics => {
    return {
      debates: parseFloat(mp.state_average_debate || mp.ag_state_average_debate || '0'),
      questions: parseFloat(mp.state_average_questions || mp.ag_state_average_questions || '0'),
      bills: parseFloat(mp.state_average_pmb || mp.ag_state_average_pmb || '0'),
      attendance: parseFloat(mp.attendance_state_average || mp.avg_attendance_state_average || '0') * 100,
    };
  };

  const ComparisonIcon = ({ mpValue, avgValue }: { mpValue: number; avgValue: number }) => {
    const diff = ((mpValue - avgValue) / avgValue) * 100;
    
    if (Math.abs(diff) < 5) {
      return <Minus className="w-4 h-4 text-[#FF9800]" />;
    }
    if (diff > 0) {
      return <TrendingUp className="w-4 h-4 text-[#4CAF50]" />;
    }
    return <TrendingDown className="w-4 h-4 text-[#EF5350]" />;
  };

  const PerformanceComparison = ({ mp }: { mp: Politician }) => {
    const mpMetrics = getPerformanceMetrics(mp);
    const nationalAvg = getNationalAverages(mp);
    const stateAvg = getStateAverages(mp);

    return (
      <div className="mt-4">
        <h4 className="font-semibold text-[#263238] mb-3">Performance Comparison</h4>
        
        <div className="space-y-3">
          {/* Debates Comparison */}
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#263238]">Debates</span>
              <span className="text-lg font-bold text-[#263238]">{mpMetrics.debates.toFixed(0)}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.debates} avgValue={nationalAvg.debates} />
                  <span className="text-[#424242]">National Avg: {nationalAvg.debates.toFixed(1)}</span>
                </div>
                <span className={mpMetrics.debates >= nationalAvg.debates ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.debates >= nationalAvg.debates ? '+' : ''}
                  {(mpMetrics.debates - nationalAvg.debates).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.debates} avgValue={stateAvg.debates} />
                  <span className="text-[#424242]">State Avg: {stateAvg.debates.toFixed(1)}</span>
                </div>
                <span className={mpMetrics.debates >= stateAvg.debates ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.debates >= stateAvg.debates ? '+' : ''}
                  {(mpMetrics.debates - stateAvg.debates).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Questions Comparison */}
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#263238]">Questions</span>
              <span className="text-lg font-bold text-[#263238]">{mpMetrics.questions.toFixed(0)}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.questions} avgValue={nationalAvg.questions} />
                  <span className="text-[#424242]">National Avg: {nationalAvg.questions.toFixed(1)}</span>
                </div>
                <span className={mpMetrics.questions >= nationalAvg.questions ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.questions >= nationalAvg.questions ? '+' : ''}
                  {(mpMetrics.questions - nationalAvg.questions).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.questions} avgValue={stateAvg.questions} />
                  <span className="text-[#424242]">State Avg: {stateAvg.questions.toFixed(1)}</span>
                </div>
                <span className={mpMetrics.questions >= stateAvg.questions ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.questions >= stateAvg.questions ? '+' : ''}
                  {(mpMetrics.questions - stateAvg.questions).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Comparison */}
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#263238]">Attendance</span>
              <span className="text-lg font-bold text-[#263238]">{mpMetrics.attendance.toFixed(1)}%</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.attendance} avgValue={nationalAvg.attendance} />
                  <span className="text-[#424242]">National Avg: {nationalAvg.attendance.toFixed(1)}%</span>
                </div>
                <span className={mpMetrics.attendance >= nationalAvg.attendance ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.attendance >= nationalAvg.attendance ? '+' : ''}
                  {(mpMetrics.attendance - nationalAvg.attendance).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.attendance} avgValue={stateAvg.attendance} />
                  <span className="text-[#424242]">State Avg: {stateAvg.attendance.toFixed(1)}%</span>
                </div>
                <span className={mpMetrics.attendance >= stateAvg.attendance ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.attendance >= stateAvg.attendance ? '+' : ''}
                  {(mpMetrics.attendance - stateAvg.attendance).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Bills Comparison */}
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#263238]">Private Member Bills</span>
              <span className="text-lg font-bold text-[#263238]">{mpMetrics.bills.toFixed(0)}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.bills} avgValue={nationalAvg.bills} />
                  <span className="text-[#424242]">National Avg: {nationalAvg.bills.toFixed(1)}</span>
                </div>
                <span className={mpMetrics.bills >= nationalAvg.bills ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.bills >= nationalAvg.bills ? '+' : ''}
                  {(mpMetrics.bills - nationalAvg.bills).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <ComparisonIcon mpValue={mpMetrics.bills} avgValue={stateAvg.bills} />
                  <span className="text-[#424242]">State Avg: {stateAvg.bills.toFixed(1)}</span>
                </div>
                <span className={mpMetrics.bills >= stateAvg.bills ? 'text-[#4CAF50]' : 'text-[#EF5350]'}>
                  {mpMetrics.bills >= stateAvg.bills ? '+' : ''}
                  {(mpMetrics.bills - stateAvg.bills).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RepresentativeCard = ({ mp, house }: { mp: Politician; house: 'Lok Sabha' | 'Rajya Sabha' }) => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="comparison">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <div className="p-4 bg-gradient-to-r from-[#FAFAFA] to-[#ECEFF1] rounded-lg">
          <div className="flex items-start gap-4">
            <Avatar className={`w-16 h-16 ${house === 'Lok Sabha' ? 'bg-[#FF9800]' : 'bg-[#00BCD4]'} text-white`}>
              <AvatarFallback className={`${house === 'Lok Sabha' ? 'bg-[#FF9800]' : 'bg-[#00BCD4]'} text-white text-lg`}>
                {getInitials(mp.mp_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[#263238] text-lg">{mp.mp_name}</h3>
                  <p className="text-sm text-[#424242]">{mp.mp_political_party}</p>
                </div>
                <Badge variant={house === 'Lok Sabha' ? 'default' : 'secondary'}>
                  {house} MP
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#424242] mb-2">
                <MapPin className="w-4 h-4" />
                <span>{mp.pc_name || mp.state}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-xs text-[#424242]">Attendance</p>
                  <p className={`text-sm font-bold ${getAttendanceColor(mp.attendance || mp.avg_attendance || '')}`}>
                    {formatAttendance(mp.attendance || mp.avg_attendance || '')}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-xs text-[#424242]">Debates</p>
                  <p className="text-sm font-bold text-[#263238]">
                    {mp.debates || mp.ag_debates || '0'}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-xs text-[#424242]">Questions</p>
                  <p className="text-sm font-bold text-[#263238]">
                    {mp.questions || mp.ag_questions || '0'}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-xs text-[#424242]">Bills</p>
                  <p className="text-sm font-bold text-[#263238]">
                    {mp.private_member_bills || mp.ag_private_member_bills || '0'}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <a 
                  href={`/politician-tracker`}
                  className="text-xs px-3 py-1.5 bg-[#00BCD4] text-white rounded hover:bg-[#0097A7] transition-colors flex items-center gap-1"
                >
                  View Full Profile
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="comparison" className="mt-4">
        <div className="p-4 bg-gradient-to-r from-[#FAFAFA] to-[#ECEFF1] rounded-lg">
          <PerformanceComparison mp={mp} />
        </div>
      </TabsContent>
    </Tabs>
  );

  if (loading) {
    return (
      <Card className="border-[#ECEFF1]">
        <CardHeader>
          <CardTitle className="text-[#263238] flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Representatives
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

  if (!lokSabhaMP && !rajyaSabhaMP) {
    return (
      <Card className="border-[#ECEFF1]">
        <CardHeader>
          <CardTitle className="text-[#263238] flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Representatives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[#424242]">No representatives found for {constituency}, {state}</p>
            <p className="text-sm text-[#424242] mt-2">Try adjusting your constituency in settings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#ECEFF1]">
      <CardHeader>
        <CardTitle className="text-[#263238] flex items-center gap-2">
          <User className="w-5 h-5" />
          Your Representatives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lokSabhaMP && <RepresentativeCard mp={lokSabhaMP} house="Lok Sabha" />}
        {rajyaSabhaMP && <RepresentativeCard mp={rajyaSabhaMP} house="Rajya Sabha" />}
      </CardContent>
    </Card>
  );
};

export default YourRepresentatives;