import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/' || 
    path === '/login' || 
    path === '/signup' || 
    path === '/features' ||
    path === '/pricing' ||
    path === '/about' ||
    path === '/contact';

  // Define protected paths that require authentication
  const isProtectedPath = path.startsWith('/dashboard') ||
    path.startsWith('/cases') ||
    path.startsWith('/documents') ||
    path.startsWith('/calendar') ||
    path.startsWith('/learning') ||
    path.startsWith('/resources') ||
    path.startsWith('/network') ||
    path.startsWith('/settings');

  // Get the token from the session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login page for protected routes
  if (!isAuthenticated && isProtectedPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}; 