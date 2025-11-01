"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MapPin, Award } from 'lucide-react';
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

  const debatesCount = politician.ag_debates || politician.debates || '0';
  const questionsCount = politician.ag_questions || politician.questions || '0';
  const billsCount = politician.ag_private_member_bills || politician.private_member_bills || '0';

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer border-[#ECEFF1]"
        onClick={() => setShowDetail(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 text-[#263238]">{politician.mp_name}</CardTitle>
              <p className="text-sm text-[#424242] mt-1">{politician.mp_political_party}</p>
            </div>
            <Badge variant={politician.mp_gender === 'Male' ? 'default' : 'secondary'}>
              {politician.mp_gender}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[#424242]">
            <MapPin className="w-4 h-4 text-[#00BCD4]" />
            <span className="truncate">{politician.pc_name || politician.state}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#424242]">
            <Award className="w-4 h-4 text-[#FF9800]" />
            <span className="truncate">{politician.educational_qualification || 'N/A'}</span>
          </div>

          <div className="pt-2 border-t border-[#ECEFF1]">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#424242]">Attendance</span>
              <span className={`text-sm font-semibold ${getAttendanceColor(attendancePercent)}`}>
                {attendancePercent}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ECEFF1] text-center">
            <div>
              <p className="text-xs text-[#424242]">Debates</p>
              <p className="text-sm font-semibold text-[#263238]">{debatesCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#424242]">Questions</p>
              <p className="text-sm font-semibold text-[#263238]">{questionsCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#424242]">Bills</p>
              <p className="text-sm font-semibold text-[#263238]">{billsCount}</p>
            </div>
          </div>
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