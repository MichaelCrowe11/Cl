import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Paths that require usage tracking
const USAGE_TRACKED_PATHS = [
  '/api/ide/files',
  '/api/ide/upload',
  '/api/ide/save',
  '/api/ai/chat',
  '/api/ai/complete',
  '/api/ai/generate',
];

// Heavy usage endpoints that consume tokens
const TOKEN_CONSUMING_PATHS = [
  '/api/ai/chat',
  '/api/ai/complete',
  '/api/ai/generate',
];

// File operation endpoints
const FILE_OPERATION_PATHS = [
  '/api/ide/files',
  '/api/ide/upload',
  '/api/ide/save',
];

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/platform',
  '/chat', 
  '/ide',
  '/ide-pro',
  '/crowe-logic',
  '/api/health',
  '/manifest.webmanifest',
  '/robots.txt',
  '/sitemap.xml'
];

// Security middleware for CroweOS Pro IDE with usage tracking
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const clientIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';
  const now = Date.now();
  const { pathname } = request.nextUrl;

  // Allow public paths without restrictions
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path))) {
    // Add security headers for public pages
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  // Usage tracking for specific endpoints
  if (USAGE_TRACKED_PATHS.some(path => pathname.startsWith(path))) {
    try {
      // Get user session
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });

      if (token?.email) {
        // Check usage limits before allowing the request
        const usageResponse = await fetch(
          `${request.nextUrl.origin}/api/usage`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Cookie': request.headers.get('cookie') || '',
            },
          }
        );

        if (usageResponse.ok) {
          const usage = await usageResponse.json();
          
          // Check token limits for AI endpoints
          if (TOKEN_CONSUMING_PATHS.some(path => pathname.startsWith(path))) {
            if (usage.tokensUsed >= usage.tokenLimit) {
              return NextResponse.json(
                { 
                  error: 'Token limit exceeded',
                  message: `You have used ${usage.tokensUsed}/${usage.tokenLimit} tokens today. Please upgrade your plan or wait until tomorrow.`,
                  upgrade: usage.plan === 'FREE' ? '/pricing' : null
                },
                { status: 429 }
              );
            }
          }

          // Check file limits for file operations
          if (FILE_OPERATION_PATHS.some(path => pathname.startsWith(path))) {
            if (usage.filesUploaded >= usage.fileLimit) {
              return NextResponse.json(
                {
                  error: 'File limit exceeded',
                  message: `You have uploaded ${usage.filesUploaded}/${usage.fileLimit} files today. Please upgrade your plan or wait until tomorrow.`,
                  upgrade: usage.plan === 'FREE' ? '/pricing' : null
                },
                { status: 429 }
              );
            }
          }

          // Add usage info to request headers for the API route
          response.headers.set('X-Usage-Tokens', usage.tokensUsed.toString());
          response.headers.set('X-Usage-Files', usage.filesUploaded.toString());
          response.headers.set('X-Usage-Plan', usage.plan);
        }
      }
    } catch (error) {
      console.error('Usage tracking middleware error:', error);
      // Continue with request if usage tracking fails
    }
  }

  // Rate limiting: 100 requests per minute per IP
  const rateLimitKey = `rate_limit:${clientIP}`;
  const rateLimitData = rateLimitStore.get(rateLimitKey);
  
  if (rateLimitData) {
    if (now < rateLimitData.resetTime) {
      if (rateLimitData.count >= 100) {
        return new Response('Rate limit exceeded', { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitData.resetTime.toString()
          }
        });
      }
      rateLimitData.count++;
    } else {
      // Reset window
      rateLimitStore.set(rateLimitKey, { count: 1, resetTime: now + 60000 });
    }
  } else {
    rateLimitStore.set(rateLimitKey, { count: 1, resetTime: now + 60000 });
  }

  // Security headers (additional runtime checks)
  response.headers.set('X-Request-ID', crypto.randomUUID());
  response.headers.set('X-Powered-By', 'CroweOS Pro IDE v2.8.1');

  // API route protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Check for API key on sensitive endpoints
    const sensitiveEndpoints = ['/api/scaffold', '/api/ai', '/api/terminal'];
    const isSensitive = sensitiveEndpoints.some(endpoint => 
      request.nextUrl.pathname.startsWith(endpoint)
    );

    if (isSensitive) {
      const apiKey = request.headers.get('x-api-key');
      const authHeader = request.headers.get('authorization');
      
      if (!apiKey && !authHeader) {
        return new Response('Unauthorized', { 
          status: 401,
          headers: { 'WWW-Authenticate': 'Bearer realm="CroweOS Pro IDE"' }
        });
      }
    }

    // CORS for API endpoints
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
            ? 'https://www.croweos.com' 
            : '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
  }

  // Block suspicious user agents (only for sensitive endpoints)
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  if (isSuspicious && pathname.startsWith('/api/') && !pathname.startsWith('/api/health')) {
    return new Response('Forbidden', { status: 403 });
  }

  // Security logging for audit trail (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      userAgent,
      ip: clientIP,
      referer: request.headers.get('referer'),
      requestId: response.headers.get('X-Request-ID')
    }));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match only API routes and sensitive paths, not all routes
     * This prevents blocking static assets and public pages
     */
    '/api/((?!health).*)',
    '/dashboard/:path*',
    '/admin/:path*'
  ],
};
