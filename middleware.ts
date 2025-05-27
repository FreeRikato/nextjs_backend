import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";

export const config = {
  matcher: ["/api/:path*"],
};

export default async function middleware(request: NextRequest) {
  try {
    if (
      request.nextUrl.pathname.startsWith("/api/product") ||
      request.nextUrl.pathname.includes("api/user/profile")
    ) {
      const authResult = await authMiddleware(request);

      if (authResult.status === 400 || !authResult.email) {
        return NextResponse.json(
          { msg: "No data found in headers" },
          { status: 400 }
        );
      }
      if (authResult.status === 403) {
        return NextResponse.json(
          { msg: "Invalid JWT or Session expired" },
          { status: 403 }
        );
      }
      const emailHeader = new Headers(request.headers);

      emailHeader.set("x-user-email", authResult.email);

      return NextResponse.next({
        request: {
          headers: emailHeader,
        },
      });
    }
  } catch (e) {
    console.error("Middleware error: ", e);
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
