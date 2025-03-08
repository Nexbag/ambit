import connection from "@/app/components/js/connection";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";
import verifyToken, { makeToken } from "@/app/components/js/token";
import { UserResponseType } from "@/app/components/js/dataTypes";
import Transaction from "@/app/components/models/Transaction";
import sendMassMail from "@/app/components/js/sendMail";
import { transferStartMessage } from "@/app/components/js/emails";
import bcrypt from "bcryptjs";

export const PUT = async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connection();
    const bodyRequest = await req.json();
    const tokenUser = verifyToken(req.headers.get("token") || "");
    const {
      username,
      amount,
      balance,
      pending,
      admin,

      kyc,
      verified,
      ...body
    } = bodyRequest;
    const _id = params.id;
    if (amount > 0 && !tokenUser.admin) {
      const sender = (await User.findOneAndUpdate(
        { _id: tokenUser._id, balance: { $gte: amount } },
        { $inc: { balance: amount * -1 } },
        { new: true }
      )) as UserResponseType;

      if (!sender)
        return new NextResponse(
          JSON.stringify({
            message: "Insufficient balance to complete transfer",
          }),
          { status: 402 }
        );

      await new Transaction({
        amount,
        type: 0,
        status: 0,
        network: "AG",
        username: tokenUser.username,
        wallet: _id,
      }).save();
      await sendMassMail(transferStartMessage(sender));
      return new NextResponse(
        JSON.stringify({
          message: "Transfer await confirmation",
        }),
        { status: 201 }
      );
    }

    if (amount && tokenUser.admin) {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $inc: { balance: amount },
        },
        { new: true }
      );
      return new NextResponse(JSON.stringify(updatedUser._doc), {
        status: 201,
      });
    }

    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(body.password, salt);
      body.password = hash;
    }
    const changeUser = await User.findByIdAndUpdate(
      tokenUser.admin ? _id : tokenUser._id,
      { $set: body },
      {
        new: true,
      }
    );

    const uzer = makeToken(changeUser._doc);

    return new NextResponse(JSON.stringify(uzer), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
};
export const GET = async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connection();

    const tokenUser = verifyToken(req.headers.get("token") || "");
    if (!tokenUser.admin && params.id != tokenUser._id) throw new Error();

    const data = await User.findById(params.id);

    const user = makeToken(data._doc);
    user.token = "";
    user.password = data.password;

    return new NextResponse(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
};
export const DELETE = async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connection();

    const tokenUser = verifyToken(req.headers.get("token") || "");
    if (!tokenUser.admin) throw new Error();

    await User.findByIdAndDelete(params.id);

    return new NextResponse(JSON.stringify({ message: "Success!" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
};
