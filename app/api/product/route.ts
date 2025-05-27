import { NextRequest, NextResponse } from "next/server";

export const GET = (request: NextRequest) => {
  const email = request.headers.get("x-user-email");
  return NextResponse.json(
    { msg: "Protected Route", email: email },
    { status: 200 }
  );
};
