import { NextRequest, NextResponse } from "next/server";
import { userExistReturn, userSchema } from "@/types/user";
import { prisma } from "@/lib/prisma";
import { generateToken, userExists } from "@/lib/utils";
import { hashPassword } from "@/lib/crypt";

export const GET = async () => {
    try {
        const response = await prisma.user.findMany({});
        return NextResponse.json(
            { msg: "User details retrieved successfully", response },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { msg: `Error retrieving user details: ${e}` },
            { status: 200 }
        );
    }
};

export const PATCH = async (request: NextRequest) => {
    try {
        const userEmail = request.headers.get("x-user-email");

        if (!userEmail)
            return NextResponse.json(
                { msg: "user email not found in the headers" },
                { status: 403 }
            );

        const body = await request.json();
        const { data, error, success } = userSchema.safeParse(body);

        if (!success) {
            return NextResponse.json(
                {
                    msg: "Data validation failed for updating user credentials",
                    errors: error.format(),
                },
                { status: 400 }
            );
        }

        const { email, password } = data;

        const response: userExistReturn = await userExists(userEmail);

        if (!response.exist || !response.user)
            return NextResponse.json(
                { msg: "User not found" },
                { status: 403 }
            );

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.update({
            where: { email: userEmail },
            data: { email, password: hashedPassword },
        });

        const updatedJwtToken = generateToken(email);

        return NextResponse.json(
            {
                msg: "User details updated succesfully: ",
                user,
                token: updatedJwtToken,
            },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { msg: `Error updating user details: ${e}` },
            { status: 400 }
        );
    }
};

export const DELETE = async (request: NextRequest) => {
    try {
        const userEmail = request.headers.get("x-user-email");
        console.log(userEmail, "<== User Email");

        if (!userEmail)
            return NextResponse.json(
                { msg: "user email not found in the headers" },
                { status: 403 }
            );

        const response: userExistReturn = await userExists(userEmail);

        if (!response.exist || !response.user)
            return NextResponse.json(
                { msg: "User not found" },
                { status: 403 }
            );

        const user = await prisma.user.delete({
            where: { email: userEmail },
        });

        return NextResponse.json(
            { msg: "User details deleted succesfully: ", user },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { msg: `Error updating user details: ${e}` },
            { status: 400 }
        );
    }
};
