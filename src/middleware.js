import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

/**
 * Edge middleware — Prisma-free auth config only.
 * Full Credentials + Prisma live in auth.js (Node runtime).
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === '/admin/login';
  const isLoggedIn = Boolean(req.auth?.user);

  if (isLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
