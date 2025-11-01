import { NextRequest, NextResponse } from 'next/server';
import { 
  fetchPIBReleases,
  fetchIndiaGovNews,
  fetchFinanceMinistryNews
} from '@/lib/policyScraper';
import { fallbackPolicies } from '@/lib/mockPolicies';

let policyCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const topics = searchParams.get('topics')?.split(',') || [];
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  try {
    const now = Date.now();
    
    // Use cache if valid and not forcing refresh
    if (!forceRefresh && policyCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('✅ Serving from cache');
      return filterAndReturnPolicies(policyCache, topics);
    }

    console.log('🔄 Fetching fresh policy data from live sources...');

    // Fetch from all sources with individual error handling
    const [pibData, indiaGovData, financeData] = await Promise.allSettled([
      fetchPIBReleases(),
      fetchIndiaGovNews(),
      fetchFinanceMinistryNews()
    ]);

    let allPolicies: any[] = [];
    const sources: string[] = [];

    if (pibData.status === 'fulfilled' && pibData.value.length > 0) {
      allPolicies = [...allPolicies, ...pibData.value];
      sources.push('PIB');
      console.log(`✅ PIB: ${pibData.value.length} policies`);
    } else {
      console.log('❌ PIB: Failed or no data');
    }

    if (indiaGovData.status === 'fulfilled' && indiaGovData.value.length > 0) {
      allPolicies = [...allPolicies, ...indiaGovData.value];
      sources.push('India.gov');
      console.log(`✅ India.gov: ${indiaGovData.value.length} policies`);
    } else {
      console.log('❌ India.gov: Failed or no data');
    }

    if (financeData.status === 'fulfilled' && financeData.value.length > 0) {
      allPolicies = [...allPolicies, ...financeData.value];
      sources.push('Finance Ministry');
      console.log(`✅ Finance Ministry: ${financeData.value.length} policies`);
    } else {
      console.log('❌ Finance Ministry: Failed or no data');
    }

    // If we got at least some real data
    if (allPolicies.length > 0) {
      console.log(`📊 Total live policies fetched: ${allPolicies.length}`);
      
      // Add IDs and timestamps
      allPolicies = allPolicies.map((policy, index) => ({
        ...policy,
        id: `live-${Date.now()}-${index}`,
        lastUpdated: policy.lastUpdated || new Date().toISOString().split('T')[0]
      }));

      // Remove duplicates based on title similarity
      allPolicies = allPolicies.filter((policy, index, self) => 
        index === self.findIndex(p => 
          p.title.toLowerCase().trim() === policy.title.toLowerCase().trim()
        )
      );

      console.log(`📊 After deduplication: ${allPolicies.length} unique policies`);

      // Update cache with real data
      policyCache = allPolicies;
      cacheTimestamp = now;

      return filterAndReturnPolicies(allPolicies, topics, sources);
    } else {
      console.log('⚠️ No live data available, using fallback policies');
      
      // Use fallback but don't cache it
      return filterAndReturnPolicies(fallbackPolicies, topics, ['Fallback Data']);
    }

  } catch (error) {
    console.error('❌ Critical error fetching policies:', error);
    
    // Try to use cache first, then fallback
    if (policyCache && policyCache.length > 0) {
      console.log('⚠️ Using stale cache due to error');
      return filterAndReturnPolicies(policyCache, topics, ['Cached Data']);
    }
    
    console.log('⚠️ Using fallback policies due to error');
    return filterAndReturnPolicies(fallbackPolicies, topics, ['Fallback Data']);
  }
}

function filterAndReturnPolicies(allPolicies: any[], topics: string[], sources: string[] = []) {
  let filteredPolicies = [...allPolicies];

  // Calculate relevance scores if topics provided
  if (topics.length > 0) {
    filteredPolicies = filteredPolicies.map(policy => {
      const matchedTopics = topics.filter(topic => {
        const topicLower = topic.toLowerCase();
        return (
          policy.category.toLowerCase().includes(topicLower) ||
          policy.title.toLowerCase().includes(topicLower) ||
          policy.description.toLowerCase().includes(topicLower) ||
          policy.affectedSectors.some((sector: string) => 
            sector.toLowerCase().includes(topicLower)
          )
        );
      });
      
      const relevanceScore = (matchedTopics.length / topics.length) * 100;
      
      return {
        ...policy,
        relevanceScore: relevanceScore > 0 ? relevanceScore : 10 // Give minimum 10% to all
      };
    }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  // Get top 10 policies
  const topPolicies = filteredPolicies.slice(0, 10);

  // Get categories
  const categories = Array.from(
    new Set(allPolicies.map(p => p.category))
  ).map(category => ({
    name: category,
    count: allPolicies.filter(p => p.category === category).length
  })).sort((a, b) => b.count - a.count);

  return NextResponse.json({
    policies: topPolicies,
    categories,
    total: allPolicies.length,
    sources: sources.length > 0 ? sources : ['Live Data'],
    lastUpdated: new Date().toISOString(),
    isLiveData: sources[0] !== 'Fallback Data' && sources[0] !== 'Cached Data'
  });
}