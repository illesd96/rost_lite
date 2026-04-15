import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // If user needs to change password, redirect them to the change-password page
    // (unless they're already on it, or hitting the change-password API)
    if (
      token?.requirePasswordChange &&
      pathname !== '/auth/change-password' &&
      !pathname.startsWith('/api/auth/')
    ) {
      return NextResponse.redirect(new URL('/auth/change-password', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Allow access to change-password page if authenticated
        if (pathname === '/auth/change-password') {
          return !!token;
        }

        // Protect shop routes - require authentication
        if (pathname.startsWith('/shop') ||
            pathname.startsWith('/cart') ||
            pathname.startsWith('/orders') ||
            pathname.startsWith('/checkout') ||
            pathname.startsWith('/modern-shop')) {
          return !!token;
        }

        // Protect admin routes - require admin role
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/shop/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/modern-shop/:path*',
    '/auth/change-password',
  ],
};
