import connection from "@/app/components/js/connection";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";

import verifyToken, { makeToken } from "@/app/components/js/token";
import sendMassMail from "@/app/components/js/sendMail";
import { forgotPasswordMessage } from "@/app/components/js/emails";

export async function POST(req: Request) {
  try {
    await connection();
    const body = await req.json();

    const email = body.email;
    const foundUser = await User.findOne({ email, disabled: false });
    const user = makeToken(foundUser._doc);
    await sendMassMail(forgotPasswordMessage(user));

    return new NextResponse(
      JSON.stringify({ message: "Please check your email" }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 401,
    });
  }
}
export async function PUT(req: Request) {
  try {
    await connection();
    const tUser = verifyToken(`${req.headers.get("token")}`);
    const { password } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(tUser._id, {
      $set: { password },
    });

    const user = makeToken(updatedUser._doc);

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Invalid Link!",
      }),
      { status: 401 }
    );
  }
}
