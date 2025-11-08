// middleware.js
import { NextResponse } from 'next/server';

// Define which routes require authentication
const protectedPaths = ['/dashboard'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  // Retrieve token and role from cookies
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // No token → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // optional
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard/student', request.url));
  }
  if (pathname.startsWith('/dashboard/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  // If everything checks out, continue to the requested page
  return NextResponse.next();
}

// Match all dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};