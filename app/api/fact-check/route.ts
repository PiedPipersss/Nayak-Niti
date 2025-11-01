import { NextRequest, NextResponse } from 'next/server';
import { checkFactsWithGoogle, getSourceCredibility, analyzeBias } from '@/lib/factChecker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, description, content } = body;

    if (!url && !title) {
      return NextResponse.json(
        { error: 'URL or title is required' },
        { status: 400 }
      );
    }

    console.log('Fact-checking request:', { url, title });

    const sourceCredibility = url ? getSourceCredibility(url) : null;
    const fullText = `${title || ''} ${description || ''} ${content || ''}`;
    const biasAnalysis = analyzeBias(fullText);

    let factChecks: any[] = [];
    if (title) {
      try {
        factChecks = await checkFactsWithGoogle(title);
        console.log(`Found ${factChecks.length} fact-checks`);
      } catch (error) {
        console.error('Error fetching fact-checks:', error);
      }
    }

    const assessment = generateStrictAssessment(sourceCredibility, biasAnalysis, factChecks);

    return NextResponse.json({
      sourceCredibility,
      biasAnalysis,
      factChecks: factChecks.slice(0, 5),
      assessment,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in fact-check API:', error);
    return NextResponse.json(
      { error: 'Failed to perform fact check' },
      { status: 500 }
    );
  }
}

function generateStrictAssessment(
  sourceCredibility: any,
  biasAnalysis: any,
  factChecks: any[]
): {
  overallScore: number;
  verdict: string;
  recommendation: string;
  concerns: string[];
} {
  let overallScore = 50; // Start lower, must earn credibility
  const concerns: string[] = [];

  // SOURCE CREDIBILITY (40% weight)
  if (sourceCredibility) {
    const sourceWeight = sourceCredibility.credibilityScore * 0.4;
    overallScore = sourceWeight;
    
    if (sourceCredibility.credibilityLevel === 'Low') {
      concerns.push(`⚠️ Source "${sourceCredibility.domain}" has LOW credibility rating`);
      overallScore -= 15;
    }
    
    if (sourceCredibility.credibilityLevel === 'Unknown') {
      concerns.push(`❓ Source "${sourceCredibility.domain}" is UNVERIFIED`);
      overallScore -= 10;
    }

    if (sourceCredibility.credibilityScore < 50) {
      concerns.push(`🚨 DANGER: Known unreliable source (Score: ${sourceCredibility.credibilityScore}/100)`);
    }
    
    sourceCredibility.warnings.forEach((warning: string) => {
      concerns.push(`⚠️ ${warning}`);
    });
  } else {
    concerns.push('⚠️ No source URL provided - cannot verify origin');
    overallScore -= 20;
  }

  // BIAS ANALYSIS (30% weight)
  // Clickbait penalty
  if (biasAnalysis.clickbaitScore > 20) {
    concerns.push(`🎣 CLICKBAIT detected (Score: ${biasAnalysis.clickbaitScore}/100)`);
    overallScore -= Math.min(20, biasAnalysis.clickbaitScore / 5);
  }

  // Sensationalism penalty
  if (biasAnalysis.sensationalismScore > 30) {
    concerns.push(`📢 HIGH sensationalism detected (Score: ${biasAnalysis.sensationalismScore}/100)`);
    overallScore -= Math.min(15, biasAnalysis.sensationalismScore / 7);
  }

  // Extreme bias penalty
  if (Math.abs(biasAnalysis.biasScore) > 50) {
    concerns.push(`⚖️ EXTREME ${biasAnalysis.overallBias} detected`);
    overallScore -= 15;
  } else if (Math.abs(biasAnalysis.biasScore) > 30) {
    concerns.push(`⚖️ Strong ${biasAnalysis.overallBias} detected`);
    overallScore -= 10;
  }

  // Emotional language penalty
  if (biasAnalysis.emotionalLanguage.length > 5) {
    concerns.push(`😡 Excessive emotional/loaded language (${biasAnalysis.emotionalLanguage.length} instances)`);
    overallScore -= 10;
  }

  // Opinion vs Fact penalty
  if (biasAnalysis.opinionStatements > biasAnalysis.factualStatements * 3) {
    concerns.push(`💭 Content is HEAVILY opinion-based (${biasAnalysis.opinionStatements} opinion vs ${biasAnalysis.factualStatements} factual)`);
    overallScore -= 15;
  } else if (biasAnalysis.opinionStatements > biasAnalysis.factualStatements) {
    concerns.push(`💭 More opinion than facts detected`);
    overallScore -= 8;
  }

  // Red flags from content analysis
  biasAnalysis.redFlags.forEach((flag: string) => {
    concerns.push(`🚩 ${flag}`);
    overallScore -= 5;
  });

  // FACT CHECK RESULTS (30% weight)
  const falseChecks = factChecks.filter(fc => 
    fc.rating.toLowerCase().includes('false') || 
    fc.rating.toLowerCase().includes('misleading') ||
    fc.rating.toLowerCase().includes('incorrect')
  );

  const trueChecks = factChecks.filter(fc =>
    fc.rating.toLowerCase().includes('true') ||
    fc.rating.toLowerCase().includes('correct') ||
    fc.rating.toLowerCase().includes('accurate')
  );

  if (falseChecks.length > 0) {
    concerns.push(`❌ ${falseChecks.length} related claim(s) marked as FALSE/MISLEADING by fact-checkers`);
    overallScore -= (falseChecks.length * 15);
  }

  if (trueChecks.length > 0) {
    overallScore += (trueChecks.length * 5);
  }

  // Ensure score is within bounds
  overallScore = Math.max(0, Math.min(100, overallScore));

  // Generate strict verdict
  let verdict = '';
  let recommendation = '';

  if (overallScore >= 85) {
    verdict = '✅ Highly Reliable';
    recommendation = 'Content appears trustworthy from a credible source with factual reporting';
  } else if (overallScore >= 70) {
    verdict = '✓ Generally Reliable';
    recommendation = 'Content is likely accurate but cross-verify important claims';
  } else if (overallScore >= 55) {
    verdict = '⚠️ Mixed Reliability';
    recommendation = 'Exercise caution - Verify all major claims with authoritative sources';
  } else if (overallScore >= 40) {
    verdict = '⚠️ Low Reliability';
    recommendation = 'HIGH CAUTION advised - Source has credibility issues. Seek primary sources';
  } else if (overallScore >= 25) {
    verdict = '🚨 Very Low Reliability';
    recommendation = 'SERIOUS CONCERNS detected - Likely contains misinformation. Do not share';
  } else {
    verdict = '❌ Not Credible';
    recommendation = 'EXTREME RISK - Strong indicators of fake news/propaganda. Disregard this source';
  }

  return {
    overallScore: Math.round(overallScore),
    verdict,
    recommendation,
    concerns
  };
}