import { PrismaClient } from '@prisma/client';

// Singleton Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Plan limits configuration
export const PLAN_LIMITS = {
  free: {
    tokensPerDay: 1000,
    filesPerDay: 3,
    apiCallsPerMonth: 300,
    storageGB: 0.1,
    projects: 1
  },
  pro: {
    tokensPerDay: 10000,
    filesPerDay: 25,
    apiCallsPerMonth: -1, // unlimited
    storageGB: 5,
    projects: 10
  },
  enterprise: {
    tokensPerDay: -1, // unlimited
    filesPerDay: -1, // unlimited
    apiCallsPerMonth: -1, // unlimited
    storageGB: 50,
    projects: -1 // unlimited
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

// Get or create today's usage record
export async function getTodaysUsage(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let usage = await prisma.usageRecord.findUnique({
    where: {
      userId_date: {
        userId,
        date: today
      }
    }
  });

  if (!usage) {
    usage = await prisma.usageRecord.create({
      data: {
        userId,
        date: today,
        tokenCount: 0,
        fileUploadCount: 0,
        apiCallCount: 0,
        storageUsedMB: 0
      }
    });
  }

  return usage;
}

// Track token usage
export async function trackTokenUsage(userId: string, tokens: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update daily usage
  await prisma.usageRecord.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    update: {
      tokenCount: {
        increment: tokens
      }
    },
    create: {
      userId,
      date: today,
      tokenCount: tokens,
      fileUploadCount: 0,
      apiCallCount: 0,
      storageUsedMB: 0
    }
  });

  // Log usage event
  await prisma.usageEvent.create({
    data: {
      userId,
      eventType: 'token_usage',
      amount: tokens,
      metadata: {
        timestamp: new Date().toISOString()
      }
    }
  });
}

// Track file upload
export async function trackFileUpload(userId: string, fileCount = 1, fileSizeMB = 0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update daily usage
  await prisma.usageRecord.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    update: {
      fileUploadCount: {
        increment: fileCount
      },
      storageUsedMB: {
        increment: Math.round(fileSizeMB)
      }
    },
    create: {
      userId,
      date: today,
      tokenCount: 0,
      fileUploadCount: fileCount,
      apiCallCount: 0,
      storageUsedMB: Math.round(fileSizeMB)
    }
  });

  // Log usage event
  await prisma.usageEvent.create({
    data: {
      userId,
      eventType: 'file_upload',
      amount: fileCount,
      metadata: {
        fileSizeMB,
        timestamp: new Date().toISOString()
      }
    }
  });
}

// Track API call
export async function trackApiCall(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update daily usage
  await prisma.usageRecord.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    update: {
      apiCallCount: {
        increment: 1
      }
    },
    create: {
      userId,
      date: today,
      tokenCount: 0,
      fileUploadCount: 0,
      apiCallCount: 1,
      storageUsedMB: 0
    }
  });

  // Log usage event
  await prisma.usageEvent.create({
    data: {
      userId,
      eventType: 'api_call',
      amount: 1,
      metadata: {
        timestamp: new Date().toISOString()
      }
    }
  });
}

// Check if user has exceeded limits
export async function checkUsageLimits(userId: string, userPlan: PlanType) {
  const usage = await getTodaysUsage(userId);
  const limits = PLAN_LIMITS[userPlan];

  const violations = [];

  // Check token limit
  if (limits.tokensPerDay !== -1 && usage.tokenCount >= limits.tokensPerDay) {
    violations.push({
      type: 'tokens',
      current: usage.tokenCount,
      limit: limits.tokensPerDay,
      percentage: (usage.tokenCount / limits.tokensPerDay) * 100
    });
  }

  // Check file upload limit
  if (limits.filesPerDay !== -1 && usage.fileUploadCount >= limits.filesPerDay) {
    violations.push({
      type: 'files',
      current: usage.fileUploadCount,
      limit: limits.filesPerDay,
      percentage: (usage.fileUploadCount / limits.filesPerDay) * 100
    });
  }

  return {
    hasViolations: violations.length > 0,
    violations,
    usage,
    limits
  };
}

// Get usage percentage for UI
export function getUsagePercentage(current: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited
  return Math.min((current / limit) * 100, 100);
}

// Get warning level based on usage percentage
export function getWarningLevel(percentage: number): 'safe' | 'warning' | 'danger' {
  if (percentage >= 100) return 'danger';
  if (percentage >= 90) return 'warning';
  return 'safe';
}
