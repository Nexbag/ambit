import connection from "@/app/components/js/connection";
import { getCoinPrice } from "@/app/components/js/marketdata";
import verifyToken from "@/app/components/js/token";
import Crypto from "@/app/components/models/Crypto";
import CryptoWallet from "@/app/components/models/CryptoWallet";
import User from "@/app/components/models/User";
import WalletTranz from "@/app/components/models/WalletTranz";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    const body = await req.json();

    if (tokenUser.admin) {
      const crypto = await Crypto.findByIdAndUpdate(params.id, { $set: body });

      return new NextResponse(JSON.stringify(crypto), {
        status: 200,
      });
    }
    const data = await getCoinPrice(params.id);
    const { type, qty } = body;
    const amount = qty * data.price;
    if (qty < 0) throw new Error();
    if (type == 1) {
      const user = await User.findOneAndUpdate(
        { _id: tokenUser._id, balance: { $gte: amount } },
        { $inc: { balance: amount * -1 } },
        { new: true }
      );

      if (!user)
        return new NextResponse(
          JSON.stringify({ message: "Insufficient funds" }),
          {
            status: 402,
          }
        );
      const wallet = await CryptoWallet.findOneAndUpdate(
        { username: tokenUser.username, coin: data.foundCoin.symbol },
        { $inc: { balance: qty } },
        { new: true }
      );
      const date = new Date().getTime();
      await WalletTranz.create({
        amount,
        date,
        qty,
        type: 1,
        coin: data.foundCoin.symbol,
        username: tokenUser.username,
      });
      return new NextResponse(JSON.stringify(wallet), {
        status: 200,
      });
    }
    const wallet = await CryptoWallet.findOneAndUpdate(
      {
        username: tokenUser.username,
        coin: data.foundCoin.symbol,
        balance: { $gte: qty },
      },
      { $inc: { balance: body.qty * -1 } },
      { new: true }
    );
    if (!wallet)
      return new NextResponse(
        JSON.stringify({ message: "Insufficient funds" }),
        {
          status: 402,
        }
      );
    await User.findByIdAndUpdate(
      tokenUser._id,
      { $inc: { balance: amount } },
      { new: true }
    );
    const date = new Date().getTime();
    await WalletTranz.create({
      amount,
      date,
      type: 0,
      qty,
      coin: data.foundCoin.symbol,
      username: tokenUser.username,
    });
    return new NextResponse(JSON.stringify(wallet), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
