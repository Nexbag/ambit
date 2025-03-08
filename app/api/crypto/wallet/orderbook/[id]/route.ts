import connection from "@/app/components/js/connection";
import { CryptoOrderBookResponseType } from "@/app/components/js/dataTypes";

import verifyToken from "@/app/components/js/token";

import CryptoOrderBook from "@/app/components/models/CryptoOrderBook";
import CryptoWallet from "@/app/components/models/CryptoWallet";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connection();

    const order = await CryptoOrderBook.findById(params.id);
    return new NextResponse(JSON.stringify(order), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    if (!tokenUser.admin) throw new Error();
    const body = await req.json();
    const { basePrice, newPrice, baseQty, date } = body;
    const amount = basePrice * baseQty;
    const newQty = amount / newPrice;
    const order = (await CryptoOrderBook.findByIdAndUpdate(params.id, {
      $set: {
        basePrice,
        newPrice,
        newQty,
        baseQty,
        date,
      },
    })) as CryptoOrderBookResponseType;
    const qty = newQty - order.newQty;
    const upBaseQty = order.baseQty - baseQty;
    console.log({
      basePrice,
      newPrice,
      newQty,
      baseQty,
      date,
      qty,
      upBaseQty,
    });

    await CryptoWallet.findOneAndUpdate(
      {
        username: order.username,
        coin: order.newCoin,
      },
      { $inc: { balance: qty } },
      { new: true }
    );
    await CryptoWallet.findOneAndUpdate(
      {
        username: order.username,
        coin: order.baseCoin,
      },
      { $inc: { balance: upBaseQty } },
      { new: true }
    );

    return new NextResponse(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
