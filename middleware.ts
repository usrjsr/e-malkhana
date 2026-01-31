import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const payload = verifyToken(token)
    const pathname = req.nextUrl.pathname

    if (pathname.includes("/disposal") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cases/:path*",
    "/properties/:path*",
    "/alerts/:path*",
    "/reports/:path*"
  ]
}
