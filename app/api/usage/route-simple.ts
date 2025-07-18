import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  getTodaysUsage, 
  trackTokenUsage, 
  trackFileUpload, 
  checkUsageLimits,
  PLAN_LIMITS,
  PlanType,
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

    const usage = await getTodaysUsage(user.id);
    const plan = user.subscriptionStatus === 'active' 
      ? (user.subscriptionPlan || 'pro').toLowerCase() as PlanType
      : 'free';
    
    const limits = PLAN_LIMITS[plan];
    
    // Calculate reset time (next midnight UTC)
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    
    return NextResponse.json({
      tokensUsed: usage.tokenCount,
      tokenLimit: limits.tokensPerDay,
      filesUploaded: usage.fileUploadCount,
      fileLimit: limits.filesPerDay,
      plan: plan.toUpperCase(),
      resetTime: tomorrow.toISOString(),
      dailyHistory: [] // TODO: implement history query
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type, amount } = body;

    if (!type || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const plan = user.subscriptionStatus === 'active' 
      ? (user.subscriptionPlan || 'pro').toLowerCase() as PlanType
      : 'free';

    // Check limits before tracking
    const limitCheck = await checkUsageLimits(user.id, plan);
    
    if (limitCheck.hasViolations) {
      const violation = limitCheck.violations[0]; // Get first violation
      return NextResponse.json(
        { 
          error: 'Usage limit exceeded',
          message: `${violation.type} limit exceeded: ${violation.current}/${violation.limit}`,
          upgrade: plan === 'free' ? '/pricing' : null
        },
        { status: 429 }
      );
    }

    // Track the usage
    if (type === 'tokens') {
      await trackTokenUsage(user.id, amount);
    } else if (type === 'file') {
      await trackFileUpload(user.id);
    } else {
      return NextResponse.json({ error: 'Invalid usage type' }, { status: 400 });
    }

    // Return updated usage
    const usage = await getTodaysUsage(user.id);
    const limits = PLAN_LIMITS[plan];
    
    return NextResponse.json({
      success: true,
      tokensUsed: usage.tokenCount,
      tokenLimit: limits.tokensPerDay,
      filesUploaded: usage.fileUploadCount,
      fileLimit: limits.filesPerDay,
      plan: plan.toUpperCase()
    });

  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
