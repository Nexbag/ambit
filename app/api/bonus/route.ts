import connection from "@/app/components/js/connection";
import { BonusMessageStart } from "@/app/components/js/emails";
import sendMassMail from "@/app/components/js/sendMail";
import verifyToken from "@/app/components/js/token";
import Bonus from "@/app/components/models/Bonus";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    if (!tokenUser.admin) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { username, amount, redeemAmount } = await req.json();
    const bon = await new Bonus({
      amount,
      username,
      redeemAmount,
    }).save();

    const user = await User.findOneAndUpdate(
      { username },
      {
        $inc: {
          pending: amount,
        },
      },
      { new: true }
    );
    await sendMassMail(BonusMessageStart(user, bon));
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Some error occured" }), {
      status: 401,
    });
  }
}
export async function GET(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const status = url.searchParams.get("status");

    if (username && status) {
      const bonus = await Bonus.find({
        status,
        username: tokenUser.admin ? username : tokenUser.username,
      }).sort({
        _id: -1,
      });
      return new NextResponse(JSON.stringify(bonus), {
        status: 200,
      });
    }
    if (username) {
      const bonus = await Bonus.find({
        username: tokenUser.admin ? username : tokenUser.username,
      }).sort({
        _id: -1,
      });
      return new NextResponse(JSON.stringify(bonus), {
        status: 200,
      });
    }
    if (status) {
      const bonus = tokenUser.admin
        ? await Bonus.find({ status }).sort({
            _id: -1,
          })
        : await Bonus.find({ status, username: tokenUser.username }).sort({
            _id: -1,
          });
      return new NextResponse(JSON.stringify(bonus), {
        status: 200,
      });
    }
    const bonus = await Bonus.find().sort({ _id: -1 });
    return new NextResponse(JSON.stringify(bonus), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
