import connection from "@/app/components/js/connection";
import Referral from "@/app/components/models/Referral";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import verifyToken, { makeToken } from "@/app/components/js/token";
import sendMassMail from "@/app/components/js/sendMail";
import { refMessage, welcomeMessage } from "@/app/components/js/emails";
import { UserResponseType } from "@/app/components/js/dataTypes";

export async function POST(req: Request) {
  try {
    await connection();
    const body = await req.json();
    const { username, referredBy: rUsername, password: inputPass } = body;
    body.admin = false;
    body.referredBy = "";

    body.balance = 0;
    body.pending = 0;
    let rUser = {};
    let hasReferral = false;
    if (rUsername) {
      const userExist = await Referral.findOne({
        username: username.toLowerCase(),
      });

      const refBy = await User.findOne({
        username: rUsername.toLowerCase(),
      });
      if (refBy && !userExist) {
        rUser = refBy._doc;
        hasReferral = true;
        body.referredBy = rUsername.toLowerCase();
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(inputPass, salt);
    body.password = hash;
    const newUser = await new User(body).save();

    const user = makeToken(newUser._doc);

    await sendMassMail(welcomeMessage(user));
    if (hasReferral) {
      await new Referral({
        username: username.toLowerCase(),
        rUsername: rUsername.toLowerCase(),
      }).save();

      await sendMassMail(refMessage(user, rUser as UserResponseType));
    }

    return new NextResponse(JSON.stringify(user), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Failed" }), {
      status: 401,
    });
  }
}
export async function PUT(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const fUser = await User.findById(tokenUser._id);

    const user = makeToken(fUser._doc);

    const sent = await sendMassMail(welcomeMessage(user));
    if (!sent) throw new Error();

    return new NextResponse(
      JSON.stringify({
        message: `Please check your email for an activation link.`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Some error occured, please try again after some time.",
      }),
      { status: 401 }
    );
  }
}
