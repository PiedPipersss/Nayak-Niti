'use client';

import React, { useEffect, useState } from 'react';
import PoliticianStanceTracker from '@/components/PoliticianStanceTracker';
import Papa from 'papaparse';
import { Politician } from '@/types/politician';

export default function PoliticianTrackerPage() {
  const [lokSabhaData, setLokSabhaData] = useState<Politician[]>([]);
  const [rajyaSabhaData, setRajyaSabhaData] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Lok Sabha data
        const lokSabhaResponse = await fetch('/PoliticiansData/18 LS MP Track.csv');
        if (!lokSabhaResponse.ok) throw new Error('Failed to load Lok Sabha data');
        const lokSabhaText = await lokSabhaResponse.text();
        const lokSabhaParsed = Papa.parse(lokSabhaText, { header: true });
        
        // Load Rajya Sabha data
        const rajyaSabhaResponse = await fetch('/PoliticiansData/RS MP Track.csv');
        if (!rajyaSabhaResponse.ok) throw new Error('Failed to load Rajya Sabha data');
        const rajyaSabhaText = await rajyaSabhaResponse.text();
        const rajyaSabhaParsed = Papa.parse(rajyaSabhaText, { header: true });

        // Filter out empty rows
        const lokSabhaFiltered = lokSabhaParsed.data.filter((row: any) => row.mp_name && row.mp_name.trim() !== '');
        const rajyaSabhaFiltered = rajyaSabhaParsed.data.filter((row: any) => row.mp_name && row.mp_name.trim() !== '');

        setLokSabhaData(lokSabhaFiltered as Politician[]);
        setRajyaSabhaData(rajyaSabhaFiltered as Politician[]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
          <p className="mt-4 text-[#424242]">Loading politician data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1]">
        <div className="text-center">
          <p className="text-[#EF5350] text-xl">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-[#FF9800] text-white rounded-lg hover:bg-[#FFB74D]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] py-8">
      <PoliticianStanceTracker 
        lokSabhaData={lokSabhaData}
        rajyaSabhaData={rajyaSabhaData}
      />
    </div>
  );
}