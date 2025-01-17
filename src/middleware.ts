import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/admin"];
const authRoutes = ["/auth/log-in"];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isAuthRoute = authRoutes.includes(path);

	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL("/auth/log-in", req.nextUrl));
	}

	if (isAuthRoute && session?.userId) {
		return NextResponse.redirect(new URL("/admin", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
