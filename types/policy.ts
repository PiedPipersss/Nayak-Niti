export interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Proposed' | 'Under Review' | 'Passed' | 'Implemented' | 'Rejected';
  dateIntroduced: string;
  lastUpdated: string;
  affectedSectors: string[];
  keyPoints: string[];
  source: string;
  sourceUrl: string;
  impact: 'High' | 'Medium' | 'Low';
  relevanceScore?: number;
}

export interface PolicyCategory {
  name: string;
  icon: string;
  count: number;
}