import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/chat',
    '/batches',
    '/experiments',
    '/protocols',
    '/reports',
    '/simulations',
    '/profile',
    '/settings',
  ]

  const isProtectedPath = protectedPaths.some((path) => 
    req.nextUrl.pathname.startsWith(path)
  )

  // If the path is protected and there's no session, redirect to login
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is logged in and tries to access auth pages, redirect to dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth/')) {
    // Allow access to callback page
    if (req.nextUrl.pathname === '/auth/callback') {
      return res
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 