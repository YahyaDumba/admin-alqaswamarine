import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/products', '/settings'];

// Routes only accessible when NOT logged in
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;
    const isAuthenticated = Boolean(token);

    // Redirect root path based on auth state
    if (pathname === '/') {
        return NextResponse.redirect(
            new URL(isAuthenticated ? '/dashboard' : '/login', request.url)
        );
    }

    // If authenticated and trying to access auth pages → redirect to dashboard
    if (isAuthenticated && authRoutes.some((r) => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If NOT authenticated and trying to access protected pages → redirect to login
    if (!isAuthenticated && protectedRoutes.some((r) => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Run middleware on all routes except Next.js internals and static assets
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|Images|icons).*)'],
};
