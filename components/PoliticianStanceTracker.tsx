"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Building, Flag, Filter, TrendingUp, Award, MapPin, SlidersHorizontal } from 'lucide-react';
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
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'debates'>('name');
  const [showFilters, setShowFilters] = useState(false);

  const currentData = selectedHouse === 'lok' ? lokSabhaData : rajyaSabhaData;

  // Get unique states and parties
  const states = useMemo(() => {
    return ['all', ...Array.from(new Set(currentData.map(p => p.state))).sort()];
  }, [currentData]);

  const parties = useMemo(() => {
    return ['all', ...Array.from(new Set(currentData.map(p => p.mp_political_party))).sort()];
  }, [currentData]);

  const filteredData = useMemo(() => {
    let filtered = currentData.filter((politician) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        politician.mp_name.toLowerCase().includes(searchLower) ||
        politician.state.toLowerCase().includes(searchLower) ||
        politician.mp_political_party.toLowerCase().includes(searchLower) ||
        (politician.pc_name && politician.pc_name.toLowerCase().includes(searchLower));

      const matchesState = selectedState === 'all' || politician.state === selectedState;
      const matchesParty = selectedParty === 'all' || politician.mp_political_party === selectedParty;

      return matchesSearch && matchesState && matchesParty;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.mp_name.localeCompare(b.mp_name);
      } else if (sortBy === 'attendance') {
        const aAtt = parseFloat(a.attendance || a.avg_attendance || '0');
        const bAtt = parseFloat(b.attendance || b.avg_attendance || '0');
        return bAtt - aAtt;
      } else if (sortBy === 'debates') {
        const aDeb = parseFloat(a.debates || a.ag_debates || '0');
        const bDeb = parseFloat(b.debates || b.ag_debates || '0');
        return bDeb - aDeb;
      }
      return 0;
    });

    return filtered;
  }, [currentData, searchTerm, selectedState, selectedParty, sortBy]);

  const stats = {
    total: currentData.length,
    states: [...new Set(currentData.map(p => p.state))].length,
    parties: [...new Set(currentData.map(p => p.mp_political_party))].length,
    avgAttendance: (currentData.reduce((sum, p) => {
      const att = parseFloat(p.attendance || p.avg_attendance || '0');
      return sum + att;
    }, 0) / currentData.length * 100).toFixed(1),
  };

  const topPerformers = useMemo(() => {
    return [...currentData]
      .sort((a, b) => {
        const aAtt = parseFloat(a.attendance || a.avg_attendance || '0');
        const bAtt = parseFloat(b.attendance || b.avg_attendance || '0');
        return bAtt - aAtt;
      })
      .slice(0, 3);
  }, [currentData]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FF9800] via-[#FFB74D] to-[#00BCD4] rounded-2xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Politician Stance Tracker</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Track and analyze the performance of Indian Parliament members with comprehensive data and insights
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-[#ECEFF1] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#424242] font-semibold">Total MPs</p>
                <p className="text-3xl font-bold text-[#263238] mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00BCD4] to-[#0097A7] flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEFF1] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#424242] font-semibold">States/UTs</p>
                <p className="text-3xl font-bold text-[#263238] mt-1">{stats.states}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#388E3C] flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEFF1] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#424242] font-semibold">Parties</p>
                <p className="text-3xl font-bold text-[#263238] mt-1">{stats.parties}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center">
                <Flag className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEFF1] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#424242] font-semibold">Avg Attendance</p>
                <p className="text-3xl font-bold text-[#263238] mt-1">{stats.avgAttendance}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers Section */}
      <Card className="border-[#ECEFF1] bg-gradient-to-br from-white to-[#FAFAFA]">
        <CardHeader>
          <CardTitle className="text-[#263238] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF9800]" />
            Top Performers by Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {topPerformers.map((mp, index) => (
              <div key={mp.mp_index || mp.mp_election_index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-[#ECEFF1] hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                  'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#263238] truncate">{mp.mp_name}</p>
                  <p className="text-xs text-[#424242] truncate">{mp.mp_political_party}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#4CAF50]">
                    {(parseFloat(mp.attendance || mp.avg_attendance || '0') * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border-[#ECEFF1] shadow-xl">
        <CardHeader className="border-b border-[#ECEFF1] bg-gradient-to-r from-[#FAFAFA] to-white">
          <CardTitle className="text-[#263238] text-2xl">Parliament Members Directory</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={selectedHouse} onValueChange={(v) => {
            setSelectedHouse(v as 'lok' | 'rajya');
            setSelectedState('all');
            setSelectedParty('all');
          }}>
            <div className="space-y-6">
              {/* Tabs and Search */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <TabsList className="grid w-full md:w-auto grid-cols-2 h-12">
                  <TabsTrigger value="lok" className="px-8 text-base">
                    <Building className="w-4 h-4 mr-2" />
                    Lok Sabha ({lokSabhaData.length})
                  </TabsTrigger>
                  <TabsTrigger value="rajya" className="px-8 text-base">
                    <Users className="w-4 h-4 mr-2" />
                    Rajya Sabha ({rajyaSabhaData.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#424242] w-5 h-5" />
                    <Input
                      placeholder="Search by name, state, party, or constituency..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 h-12 rounded-md border-2 transition-all ${
                      showFilters 
                        ? 'bg-[#FF9800] text-white border-[#FF9800]' 
                        : 'bg-white text-[#263238] border-[#00BCD4] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filters Section */}
              {showFilters && (
                <div className="bg-gradient-to-r from-[#FAFAFA] to-[#ECEFF1] p-4 rounded-xl border border-[#ECEFF1] space-y-4">
                  <h3 className="font-semibold text-[#263238] flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* State Filter */}
                    <div>
                      <label className="text-sm font-medium text-[#424242] mb-2 block">State/UT</label>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-[#00BCD4] bg-white text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                      >
                        {states.map(state => (
                          <option key={state} value={state}>
                            {state === 'all' ? 'All States' : state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Party Filter */}
                    <div>
                      <label className="text-sm font-medium text-[#424242] mb-2 block">Political Party</label>
                      <select
                        value={selectedParty}
                        onChange={(e) => setSelectedParty(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-[#00BCD4] bg-white text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                      >
                        {parties.map(party => (
                          <option key={party} value={party}>
                            {party === 'all' ? 'All Parties' : party}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium text-[#424242] mb-2 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-md border border-[#00BCD4] bg-white text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                      >
                        <option value="name">Name (A-Z)</option>
                        <option value="attendance">Attendance (High to Low)</option>
                        <option value="debates">Debates (High to Low)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(selectedState !== 'all' || selectedParty !== 'all') && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-[#424242]">Active filters:</span>
                      {selectedState !== 'all' && (
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-[#EF5350] hover:text-white hover:border-[#EF5350]"
                          onClick={() => setSelectedState('all')}
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {selectedState} ✕
                        </Badge>
                      )}
                      {selectedParty !== 'all' && (
                        <Badge 
                          variant="outline"
                          className="cursor-pointer hover:bg-[#EF5350] hover:text-white hover:border-[#EF5350]"
                          onClick={() => setSelectedParty('all')}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          {selectedParty} ✕
                        </Badge>
                      )}
                      <button
                        onClick={() => {
                          setSelectedState('all');
                          setSelectedParty('all');
                        }}
                        className="text-xs text-[#FF9800] hover:text-[#F57C00] font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Results Count */}
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-[#424242]">
                  Showing <span className="font-semibold text-[#263238]">{filteredData.length}</span> of{' '}
                  <span className="font-semibold text-[#263238]">{currentData.length}</span> members
                </p>
              </div>

              {/* Politician Cards */}
              <TabsContent value="lok" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.length > 0 ? (
                    filteredData.map((politician) => (
                      <PoliticianCard key={politician.mp_election_index || politician.mp_index} politician={politician} />
                    ))
                  ) : (
                    <div className="col-span-full">
                      <Card className="border-dashed border-2 border-[#ECEFF1]">
                        <CardContent className="py-12">
                          <div className="text-center">
                            <Search className="w-12 h-12 mx-auto mb-4 text-[#424242] opacity-50" />
                            <p className="text-[#424242] text-lg">No politicians found matching your search</p>
                            <p className="text-sm text-[#424242] mt-2">Try adjusting your filters or search terms</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rajya" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.length > 0 ? (
                    filteredData.map((politician) => (
                      <PoliticianCard key={politician.mp_election_index || politician.mp_index} politician={politician} />
                    ))
                  ) : (
                    <div className="col-span-full">
                      <Card className="border-dashed border-2 border-[#ECEFF1]">
                        <CardContent className="py-12">
                          <div className="text-center">
                            <Search className="w-12 h-12 mx-auto mb-4 text-[#424242] opacity-50" />
                            <p className="text-[#424242] text-lg">No politicians found matching your search</p>
                            <p className="text-sm text-[#424242] mt-2">Try adjusting your filters or search terms</p>
                          </div>
                        </CardContent>
                      </Card>
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