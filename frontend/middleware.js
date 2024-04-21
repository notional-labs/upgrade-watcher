import { NextResponse } from 'next/server'

export async function middleware(request) {
  // return NextResponse.redirect(new URL('/home', request.url))
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}
