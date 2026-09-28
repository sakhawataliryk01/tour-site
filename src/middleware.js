import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = await auth();
  const isLogin = pathname === '/admin/login';

  // Login page: only redirect away if already signed in
  if (isLogin) {
    if (session) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // All other /admin routes require a session
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
