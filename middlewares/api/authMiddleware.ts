import { validateToken } from "@/lib/utils";
import { jwtValidationReturn } from "@/types/user";
import { NextRequest } from "next/server";

export async function authMiddleware(
  req: NextRequest
): Promise<jwtValidationReturn> {
  try {
    const bearerToken = req.headers.get("authorization");
    if (!bearerToken) return { status: 400, email: undefined };
    return await validateToken(bearerToken);
  } catch (e) {
    console.error("Auth Middleware error:", e);
    return { status: 403, email: undefined };
  }
}
