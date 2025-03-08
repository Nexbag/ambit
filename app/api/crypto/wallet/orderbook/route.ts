import connection from "@/app/components/js/connection";

import verifyToken from "@/app/components/js/token";

import CryptoOrderBook from "@/app/components/models/CryptoOrderBook";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connection();
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const orderBook = tokenUser.admin
      ? username
        ? await CryptoOrderBook.find({ username }).sort({ date: -1 })
        : await CryptoOrderBook.find().sort({ date: -1 })
      : await CryptoOrderBook.find({ username: tokenUser.username }).sort({
          date: -1,
        });

    return new NextResponse(JSON.stringify(orderBook), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Some Error Occured" }), {
      status: 401,
    });
  }
}
