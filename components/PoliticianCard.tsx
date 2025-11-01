"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MapPin, Award, TrendingUp, MessageSquare, FileText, Eye } from 'lucide-react';
import PoliticianDetail from './PoliticianDetail';
import { Politician } from '@/types/politician';

interface PoliticianCardProps {
  politician: Politician;
}

const PoliticianCard: React.FC<PoliticianCardProps> = ({ politician }) => {
  const [showDetail, setShowDetail] = useState(false);

  const attendanceValue = politician.avg_attendance || politician.attendance;
  const attendancePercent = attendanceValue 
    ? (parseFloat(attendanceValue) * 100).toFixed(1) 
    : 'N/A';

  const getAttendanceColor = (attendance: string) => {
    if (attendance === 'N/A') return 'text-[#424242]';
    const percent = parseFloat(attendance);
    if (percent >= 80) return 'text-[#4CAF50]';
    if (percent >= 60) return 'text-[#FF9800]';
    return 'text-[#EF5350]';
  };

  const getAttendanceBgColor = (attendance: string) => {
    if (attendance === 'N/A') return 'bg-[#ECEFF1]';
    const percent = parseFloat(attendance);
    if (percent >= 80) return 'bg-green-50';
    if (percent >= 60) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const debatesCount = politician.ag_debates || politician.debates || '0';
  const questionsCount = politician.ag_questions || politician.questions || '0';
  const billsCount = politician.ag_private_member_bills || politician.private_member_bills || '0';

  return (
    <>
      <Card 
        className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-[#ECEFF1] hover:border-[#00BCD4] relative overflow-hidden"
        onClick={() => setShowDetail(true)}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9800]/5 to-[#00BCD4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2 text-[#263238] group-hover:text-[#00BCD4] transition-colors">
                {politician.mp_name}
              </CardTitle>
              <p className="text-sm text-[#424242] mt-1 line-clamp-1">{politician.mp_political_party}</p>
            </div>
            <Badge 
              variant={politician.mp_gender === 'Male' ? 'default' : 'secondary'}
              className="shrink-0"
            >
              {politician.mp_gender}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 relative z-10">
          {/* Location and Education */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#424242]">
              <MapPin className="w-4 h-4 text-[#00BCD4] shrink-0" />
              <span className="truncate font-medium">{politician.pc_name || politician.state}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[#424242]">
              <Award className="w-4 h-4 text-[#FF9800] shrink-0" />
              <span className="truncate">{politician.educational_qualification || 'N/A'}</span>
            </div>
          </div>

          {/* Attendance Highlight */}
          <div className={`pt-3 pb-2 px-3 rounded-lg ${getAttendanceBgColor(attendancePercent)} border border-[#ECEFF1]`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[#424242] uppercase tracking-wide">Attendance Rate</span>
              <span className={`text-xl font-bold ${getAttendanceColor(attendancePercent)}`}>
                {attendancePercent}%
              </span>
            </div>
            <div className="mt-2 w-full bg-white/50 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  attendancePercent === 'N/A' ? 'bg-[#424242]' :
                  parseFloat(attendancePercent) >= 80 ? 'bg-[#4CAF50]' :
                  parseFloat(attendancePercent) >= 60 ? 'bg-[#FF9800]' : 'bg-[#EF5350]'
                }`}
                style={{ width: attendancePercent === 'N/A' ? '0%' : `${attendancePercent}%` }}
              ></div>
            </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <MessageSquare className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">Debates</p>
              <p className="text-sm font-bold text-[#263238]">{debatesCount}</p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <FileText className="w-4 h-4 mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-purple-600 font-medium">Questions</p>
              <p className="text-sm font-bold text-[#263238]">{questionsCount}</p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-orange-600" />
              <p className="text-xs text-orange-600 font-medium">Bills</p>
              <p className="text-sm font-bold text-[#263238]">{billsCount}</p>
            </div>
          </div>

          {/* View Details Button */}
          <button className="w-full mt-2 py-2 px-4 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-lg font-semibold text-sm hover:from-[#0097A7] hover:to-[#00838F] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
            <Eye className="w-4 h-4" />
            View Full Profile
          </button>
        </CardContent>
      </Card>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PoliticianDetail politician={politician} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PoliticianCard;