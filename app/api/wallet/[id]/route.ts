import { WalletResponseType } from "@/app/components/js/dataTypes";

import verifyToken from "@/app/components/js/token";
import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import Wallet from "@/app/components/models/Wallet";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const body = await req.json();

    if (tokenUser.admin) {
      const wallet = await Wallet.findByIdAndUpdate(
        params.id,
        {
          $set: body,
        },
        { new: true }
      );
      return new NextResponse(JSON.stringify(wallet), {
        status: 200,
      });
    }
    const wallet = await Wallet.findOneAndUpdate(
      { _id: params.id, username: tokenUser.username },
      {
        $set: body,
      },
      { new: true }
    );

    return new NextResponse(JSON.stringify(wallet), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized!" }), {
      status: 401,
    });
  }
}

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const wallet = (await Wallet.findById(params.id)) as WalletResponseType;
    if (wallet.username != tokenUser.username || !tokenUser.admin)
      throw new Error("unauthorized");
    return new NextResponse(JSON.stringify(wallet), {
      status: wallet == null ? 401 : 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    if (tokenUser.admin) {
      await Wallet.findByIdAndDelete(params.id);
      return new NextResponse(JSON.stringify({ message: "Successful" }), {
        status: 200,
      });
    }
    await Wallet.findOneAndDelete({
      _id: params.id,
      username: tokenUser.username,
    });

    return new NextResponse(JSON.stringify({ message: "Successful" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
