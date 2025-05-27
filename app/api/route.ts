import { NextRequest, NextResponse } from "next/server";

export const GET = () => {
  return NextResponse.json({ msg: "Hello world" }, { status: 200 });
};
