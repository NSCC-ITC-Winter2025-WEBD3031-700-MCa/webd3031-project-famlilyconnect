
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {

  const token = await getToken({ req, secret: process.env.SECRET });


  const protectedRoutes = ['/family', '/admin']; 

  console.log(token)

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