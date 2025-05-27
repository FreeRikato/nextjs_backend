import { NextRequest, NextResponse } from "next/server";
import { userExistReturn, userSchema } from "@/types/user";
import { comparePassword } from "@/lib/crypt";
import { generateToken, userExists } from "@/lib/utils";

export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { data, error, success } = userSchema.safeParse(body);

        if (!success) {
            return NextResponse.json(
                {
                    msg: "Data validation failed for login",
                    errors: error.format(),
                },
                { status: 400 }
            );
        }

        const { email, password } = data;

        const response: userExistReturn = await userExists(email);

        if (!response.exist || !response.user)
            return NextResponse.json(
                { msg: "User not found" },
                { status: 403 }
            );

        const passwordValidation = await comparePassword(
            password,
            response.user.password
        );

        if (!passwordValidation)
            return NextResponse.json(
                { msg: "Password is incorrect" },
                { status: 403 }
            );

        const token = await generateToken(email);
        return NextResponse.json(
            { msg: "User logged in successfully", token: token },
            { status: 200 }
        );
    } catch (e) {
        console.error(`Error in login: ${e}`);
        return NextResponse.json(
            {
                msg: `Error in login: ${
                    e instanceof Error ? e.message : String(e)
                }`,
            },
            { status: 400 }
        );
    }
};
