import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Paths that should remain public
const PUBLIC_PATHS = ["/", "/login", "/signup", "/api", "/_next", "/favicon.ico", "/robots.txt"]

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Allow public files and paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Protect only routes that match the matcher below (dogs, create, profile, account)
  // Check for a valid NextAuth JWT token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    // Redirect to login and preserve the original page in callbackUrl
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Only run middleware on protected routes to minimize overhead
  matcher: [
    "/dogs/:path*",
    "/create/:path*",
    "/profile/:path*",
    "/account/:path*"
  ]
}
