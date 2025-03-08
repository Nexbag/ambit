import connection from "@/app/components/js/connection";

import verifyToken from "@/app/components/js/token";

import WalletTranz from "@/app/components/models/WalletTranz";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const transactions = tokenUser.admin
      ? await WalletTranz.find().sort({ date: -1 })
      : await WalletTranz.find({ username: tokenUser.username }).sort({
          date: -1,
        });

    return new NextResponse(JSON.stringify(transactions), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Some Error Occured" }), {
      status: 401,
    });
  }
}
