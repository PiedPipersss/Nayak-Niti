"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MapPin, Award, Calendar, Building, TrendingUp, MessageSquare, FileText, BarChart3 } from 'lucide-react';
import { Politician } from '@/types/politician';
import PoliticianNews from './PoliticianNews';

interface PoliticianDetailProps {
  politician: Politician;
}

const PoliticianDetail: React.FC<PoliticianDetailProps> = ({ politician }) => {
  const attendanceValue = politician.avg_attendance || politician.attendance;
  const attendancePercent = attendanceValue 
    ? (parseFloat(attendanceValue) * 100).toFixed(1) 
    : 'N/A';

  const debatesCount = politician.ag_debates || politician.debates || '0';
  const questionsCount = politician.ag_questions || politician.questions || '0';
  const billsCount = politician.ag_private_member_bills || politician.private_member_bills || '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#263238]">{politician.mp_name}</h2>
            <p className="text-[#424242] mt-1">{politician.mp_political_party}</p>
          </div>
          <Badge className="text-sm px-3 py-1">
            {politician.mp_house}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{politician.mp_gender}</Badge>
          <Badge variant="outline">{politician.mp_age} years</Badge>
          <Badge variant="outline">{politician.term}</Badge>
          {politician.nature_membership && (
            <Badge variant="outline">{politician.nature_membership}</Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Tabs for Profile and News */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile & Performance</TabsTrigger>
          <TabsTrigger value="news">Recent News</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#00BCD4]" />
                  <div>
                    <p className="text-sm text-[#424242]">Constituency</p>
                    <p className="font-semibold text-[#263238]">{politician.pc_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#4CAF50]" />
                  <div>
                    <p className="text-sm text-[#424242]">State</p>
                    <p className="font-semibold text-[#263238]">{politician.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FF9800]" />
                  <div>
                    <p className="text-sm text-[#424242]">Term Period</p>
                    <p className="font-semibold text-[#263238]">
                      {politician.term_start_date || 'N/A'} - {politician.term_end_date || 'In Office'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#0097A7]" />
                  <div>
                    <p className="text-sm text-[#424242]">Education</p>
                    <p className="font-semibold text-[#263238]">{politician.educational_qualification || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Educational Details */}
          {politician.educational_qualification_details && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-[#263238]">
                  <Award className="w-5 h-5 text-[#FF9800]" />
                  Educational Details
                </h3>
                <p className="text-sm text-[#424242]">{politician.educational_qualification_details}</p>
              </CardContent>
            </Card>
          )}

          {/* Performance Metrics */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#263238]">Performance Metrics</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-[#00BCD4]" />
                    <p className="text-2xl font-bold text-[#263238]">{attendancePercent}%</p>
                    <p className="text-sm text-[#424242]">Attendance</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[#4CAF50]" />
                    <p className="text-2xl font-bold text-[#263238]">{debatesCount}</p>
                    <p className="text-sm text-[#424242]">Debates</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-[#FF9800]" />
                    <p className="text-2xl font-bold text-[#263238]">{questionsCount}</p>
                    <p className="text-sm text-[#424242]">Questions</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#0097A7]" />
                    <p className="text-2xl font-bold text-[#263238]">{billsCount}</p>
                    <p className="text-sm text-[#424242]">Private Bills</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Notes */}
          {politician.mp_note && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 text-[#263238]">Additional Information</h3>
                <p className="text-sm text-[#424242]">{politician.mp_note}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <PoliticianNews politicianName={politician.mp_name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PoliticianDetail;