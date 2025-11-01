"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Users, Building, Flag } from 'lucide-react';
import PoliticianCard from './PoliticianCard';
import { Politician } from '@/types/politician';

interface PoliticianStanceTrackerProps {
  lokSabhaData: Politician[];
  rajyaSabhaData: Politician[];
}

const PoliticianStanceTracker: React.FC<PoliticianStanceTrackerProps> = ({
  lokSabhaData,
  rajyaSabhaData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouse, setSelectedHouse] = useState<'lok' | 'rajya'>('lok');

  const currentData = selectedHouse === 'lok' ? lokSabhaData : rajyaSabhaData;

  const filteredData = currentData.filter((politician) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      politician.mp_name.toLowerCase().includes(searchLower) ||
      politician.state.toLowerCase().includes(searchLower) ||
      politician.mp_political_party.toLowerCase().includes(searchLower) ||
      (politician.pc_name && politician.pc_name.toLowerCase().includes(searchLower))
    );
  });

  const stats = {
    total: currentData.length,
    states: [...new Set(currentData.map(p => p.state))].length,
    parties: [...new Set(currentData.map(p => p.mp_political_party))].length,
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-[#263238]">Politician Stance Tracker</h1>
        <p className="text-[#424242]">Track and analyze the performance of Indian Parliament members</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#ECEFF1]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#424242]">Total MPs</p>
                <p className="text-2xl font-bold text-[#263238]">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-[#00BCD4]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#ECEFF1]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#424242]">States/UTs</p>
                <p className="text-2xl font-bold text-[#263238]">{stats.states}</p>
              </div>
              <Building className="w-8 h-8 text-[#4CAF50]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#ECEFF1]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#424242]">Political Parties</p>
                <p className="text-2xl font-bold text-[#263238]">{stats.parties}</p>
              </div>
              <Flag className="w-8 h-8 text-[#FF9800]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-[#ECEFF1]">
        <CardHeader>
          <CardTitle className="text-[#263238]">Parliament Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedHouse} onValueChange={(v) => setSelectedHouse(v as 'lok' | 'rajya')}>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <TabsList className="grid w-full md:w-auto grid-cols-2">
                  <TabsTrigger value="lok" className="px-8">
                    Lok Sabha ({lokSabhaData.length})
                  </TabsTrigger>
                  <TabsTrigger value="rajya" className="px-8">
                    Rajya Sabha ({rajyaSabhaData.length})
                  </TabsTrigger>
                </TabsList>

                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#424242] w-4 h-4" />
                  <Input
                    placeholder="Search by name, state, party, or constituency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <TabsContent value="lok" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.length > 0 ? (
                    filteredData.map((politician) => (
                      <PoliticianCard key={politician.mp_election_index || politician.mp_index} politician={politician} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-[#424242]">
                      No politicians found matching your search.
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rajya" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.length > 0 ? (
                    filteredData.map((politician) => (
                      <PoliticianCard key={politician.mp_election_index || politician.mp_index} politician={politician} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-[#424242]">
                      No politicians found matching your search.
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliticianStanceTracker;