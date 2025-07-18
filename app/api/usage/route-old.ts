import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  getTodaysUsage, 
  trackTokenUsage, 
  trackFileUpload, 
  trackApiCall,
  checkUsageLimits,
  PLAN_LIMITS,
  getUsagePercentage,
  getWarningLevel,
  type PlanType,
  prisma
} from '@/lib/usage-tracking';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userPlan = user.subscriptionPlan as PlanType;
    const usage = await getTodaysUsage(user.id);
    const limits = PLAN_LIMITS[userPlan];
    
    // Calculate usage percentages
    const tokenPercentage = getUsagePercentage(usage.tokenCount, limits.tokensPerDay);
    const filePercentage = getUsagePercentage(usage.fileUploadCount, limits.filesPerDay);
    
    // Get warning levels
    const tokenWarning = getWarningLevel(tokenPercentage);
    const fileWarning = getWarningLevel(filePercentage);

    // Get monthly usage for API calls
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthlyUsage = await prisma.usageRecord.aggregate({
      where: {
        userId: user.id,
        date: {
          gte: monthStart
        }
      },
      _sum: {
        apiCallCount: true,
        storageUsedMB: true
      }
    });

    const monthlyApiCalls = monthlyUsage._sum.apiCallCount || 0;
    const totalStorageMB = monthlyUsage._sum.storageUsedMB || 0;

    return NextResponse.json({
      usage: {
        tokenCountToday: usage.tokenCount,
        uploadCountToday: usage.fileUploadCount,
        apiCallsThisMonth: monthlyApiCalls,
        storageUsedMB: totalStorageMB
      },
      limits: {
        tokens: limits.tokensPerDay,
        files: limits.filesPerDay,
        apiCalls: limits.apiCallsPerMonth,
        storageGB: limits.storageGB
      },
      percentages: {
        tokens: tokenPercentage,
        files: filePercentage,
        apiCalls: getUsagePercentage(monthlyApiCalls, limits.apiCallsPerMonth),
        storage: getUsagePercentage(totalStorageMB / 1024, limits.storageGB)
      },
      warnings: {
        tokens: tokenWarning,
        files: fileWarning,
        apiCalls: getWarningLevel(getUsagePercentage(monthlyApiCalls, limits.apiCallsPerMonth)),
        storage: getWarningLevel(getUsagePercentage(totalStorageMB / 1024, limits.storageGB))
      },
      tier: userPlan.toUpperCase(),
      isAtLimit: tokenPercentage >= 100 || filePercentage >= 100
    });

  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount, metadata } = body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userPlan = user.subscriptionPlan as PlanType;

    // Check limits before tracking
    const currentLimits = await checkUsageLimits(user.id, userPlan);
    
    switch (action) {
      case 'track_tokens':
        if (currentLimits.hasViolations) {
          const tokenViolation = currentLimits.violations.find(v => v.type === 'tokens');
          if (tokenViolation) {
            return NextResponse.json({
              error: 'Token limit exceeded',
              limit: tokenViolation.limit,
              current: tokenViolation.current,
              upgrade_required: true
            }, { status: 429 });
          }
        }
        
        await trackTokenUsage(user.id, amount || 1);
        break;

      case 'track_file_upload':
        if (currentLimits.hasViolations) {
          const fileViolation = currentLimits.violations.find(v => v.type === 'files');
          if (fileViolation) {
            return NextResponse.json({
              error: 'File upload limit exceeded',
              limit: fileViolation.limit,
              current: fileViolation.current,
              upgrade_required: true
            }, { status: 429 });
          }
        }
        
        await trackFileUpload(user.id, amount || 1, metadata?.fileSizeMB || 0);
        break;

      case 'track_api_call':
        await trackApiCall(user.id);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Return updated usage
    const updatedUsage = await getTodaysUsage(user.id);
    const limits = PLAN_LIMITS[userPlan];

    return NextResponse.json({
      success: true,
      usage: {
        tokenCountToday: updatedUsage.tokenCount,
        uploadCountToday: updatedUsage.fileUploadCount,
        apiCallsToday: updatedUsage.apiCallCount
      },
      percentages: {
        tokens: getUsagePercentage(updatedUsage.tokenCount, limits.tokensPerDay),
        files: getUsagePercentage(updatedUsage.fileUploadCount, limits.filesPerDay)
      }
    });

  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
