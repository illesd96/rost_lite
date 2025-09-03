import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect shop routes - require authentication
        if (req.nextUrl.pathname.startsWith('/shop') || 
            req.nextUrl.pathname.startsWith('/cart') || 
            req.nextUrl.pathname.startsWith('/orders') || 
            req.nextUrl.pathname.startsWith('/checkout')) {
          return !!token;
        }
        
        // Protect admin routes - require admin role
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/shop/:path*', '/cart/:path*', '/orders/:path*', '/checkout/:path*', '/admin/:path*'],
};
