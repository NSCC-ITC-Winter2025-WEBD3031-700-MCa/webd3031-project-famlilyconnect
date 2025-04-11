
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

  console.log('Middleware running - path:', req.nextUrl.pathname);
  const token = await getToken({ req, secret: process.env.SECRET });
  console.log("Token for", req.nextUrl.pathname, ":", token); // Check Vercel logs


  const protectedRoutes = ['/family', '/admin']; 


  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {

    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/family/:path*', '/admin/:path*' ],
};

