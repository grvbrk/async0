import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const path = request.nextUrl.pathname;

  if (!token) {
    // User is not authenticated
    if (path !== "/login") {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
