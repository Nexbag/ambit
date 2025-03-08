import { BonusResponseType } from "@/app/components/js/dataTypes";
import { BonusMessageEnd } from "@/app/components/js/emails";
import sendMassMail from "@/app/components/js/sendMail";
import verifyToken from "@/app/components/js/token";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import Bonus from "@/app/components/models/Bonus";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const { status } = await req.json();

    if (!tokenUser.admin || status == 0) {
      throw new Error("Not admin");
    }

    const bon = await Bonus.findByIdAndUpdate(params.id, {
      $set: {
        status,
      },
    });
    const bonus = bon._doc as BonusResponseType;
    if (status == bon.status)
      return new NextResponse(
        JSON.stringify({ message: "Status code must be different!" }),
        {
          status: 401,
        }
      );
    bonus.status = status;
    let balance = bonus.amount;
    let pending = bonus.amount * -1;
    if (bon.status == 1 && status != 1) {
      balance = bonus.amount * -1;
      pending = bonus.amount;
    }
    if (bon.status == 0 && status == -1) {
      balance = 0;
      pending = bonus.amount * -1;
    }

    const user = await User.findOneAndUpdate(
      { username: bonus.username },
      {
        $inc: {
          balance,
          pending,
        },
      }
    );
    await sendMassMail(BonusMessageEnd(user, bonus));

    return new NextResponse(JSON.stringify(bonus), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized!" }), {
      status: 401,
    });
  }
}
