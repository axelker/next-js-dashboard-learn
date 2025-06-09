import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";


const unauthenticatedRoutes  : string [] = ["/login", "/signup", "/"];

export async function middleware(request: NextRequest) {
	const cookies = getSessionCookie(request);
	const url = request.nextUrl;
	const path = url.pathname;
	if (!cookies && !unauthenticatedRoutes.includes(path)) {
		return NextResponse.redirect(new URL("/login", url));
	}

	if (cookies && unauthenticatedRoutes.includes(path)) {
		return NextResponse.redirect(new URL("/dashboard", url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next|favicon.ico|assets|public).*)"], // Apply middleware to specific routes. ex. [/dashboard,..]
};