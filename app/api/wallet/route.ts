import verifyToken from "@/app/components/js/token";
import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import Wallet from "@/app/components/models/Wallet";
import { WalletResponseType } from "@/app/components/js/dataTypes";

export async function POST(req: Request) {
  try {
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const body = await req.json();

    await connection();

    const { coin, address } = body;
    const wallet = await new Wallet({
      coin: coin.trim(),
      address: address.trim(),
      username: tokenUser.username,
      admin: tokenUser.admin,
    }).save();

    return new NextResponse(JSON.stringify(wallet), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}

export async function GET(req: Request) {
  try {
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    await connection();
    const url = new URL(req.url);
    const address = url.searchParams.get("address");
    const admin = url.searchParams.get("admin");
    if (address) {
      const wallet = (await Wallet.findOne({
        address,
      })) as WalletResponseType;
      if (wallet.username != tokenUser.username && !tokenUser.admin)
        throw new Error("unauthorized");
      return new NextResponse(JSON.stringify(wallet), {
        status: 200,
      });
    }
    if (admin) {
      const wallets = await Wallet.find({ admin: true });
      const userWallets = await Wallet.find({ username: tokenUser.username });
      return new NextResponse(JSON.stringify({ wallets, userWallets }), {
        status: 200,
      });
    } else {
      const wallets = tokenUser.admin
        ? await Wallet.find({ admin: true })
        : await Wallet.find({ username: tokenUser.username });
      return new NextResponse(JSON.stringify(wallets), {
        status: 200,
      });
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}
