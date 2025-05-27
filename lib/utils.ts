import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./config";
import { jwtValidationReturn, userExistReturn } from "@/types/user";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const getSecretKey = () => {
  const secret = JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not defined or is empty in environment variables."
    );
  }
  return new TextEncoder().encode(secret);
};

export const generateToken = async (email: string): Promise<string> => {
  const secretKey = getSecretKey();
  const payload = { email };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN || "1h")
    .sign(secretKey);
  return token;
};

export const validateToken = async (
  bearerToken: string
): Promise<jwtValidationReturn> => {
  const token = bearerToken?.split(" ")[1];

  if (!token) {
    console.warn("validateToken called with no token string after split");
    return { status: 401, email: undefined };
  }

  const secretKey = getSecretKey();

  try {
    const { payload: decodedPayload } = await jwtVerify(token, secretKey);

    if (!decodedPayload.email || typeof decodedPayload.email !== "string")
      return NextResponse.json({ msg: "Email not found" }, { status: 403 });

    console.log("=======================");

    // const response: userExistReturn = await userExists(decodedPayload.email)

    // console.log("=======================")

    // if (!response.exist || !response.user) return NextResponse.json({ msg: "User not found" }, { status: 403 });

    return { status: 200, email: decodedPayload.email };
  } catch (e: any) {
    console.error("Token validation error:", e.message);
    return { status: 403, email: undefined };
  }
};

export const userExists = async (email: string): Promise<userExistReturn> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return { exist: false };
  return { exist: true, user };
};
