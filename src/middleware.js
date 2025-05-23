import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow access to login and signup pages
  if (pathname === '/login' || pathname === '/signup') {
    if (token) {
      // If user is already logged in, redirect based on role
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/user/dashboard', req.url));
      }
    }
    return NextResponse.next();
  }

  // Protect routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Handle role-based access
  if (pathname.startsWith('/admin')) {
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }
  }

  if (pathname.startsWith('/user')) {
    if (token.role !== 'user') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/admin/:path*',
    '/user/:path*'
  ]
}; 