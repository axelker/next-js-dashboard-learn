import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const unauthenticatedRoutes: string [] = ['/login','/signup'];

export async function middleware(request: NextRequest) {
	const cookies = getSessionCookie(request);
	const url = request.url;
	const path = request.nextUrl.pathname;
	if (!cookies) {
		return NextResponse.redirect(new URL("/", url));
	}
	if (cookies && unauthenticatedRoutes.includes(path)) {
		return NextResponse.redirect(new URL("/dashboard", url));
	}
	return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*","/login","/signup"],
};