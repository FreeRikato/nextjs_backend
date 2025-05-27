import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/types/user";
import { hashPassword } from "@/lib/crypt";
import { userExists } from "@/lib/utils";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { data, success, error } = userSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { msg: "Data validation failed for signup", errors: error.format() },
        { status: 400 }
      );
    }

    const { email, password } = data;

    const response = await userExists(email);

    if (response.exist)
      return NextResponse.json({ msg: "User already exists" }, { status: 409 });

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      { msg: "User added successfully", userId: newUser.id },
      { status: 200 }
    );
  } catch (e) {
    console.error(`Error in Signup: ${e}`);
    return NextResponse.json({ msg: `Error in Signup: ${e}` }, { status: 400 });
  }
};
