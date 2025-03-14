import connection from "@/app/components/js/connection";
import { WalletTranzResponseType } from "@/app/components/js/dataTypes";

import verifyToken from "@/app/components/js/token";
import CryptoWallet from "@/app/components/models/CryptoWallet";
import WalletTranz from "@/app/components/models/WalletTranz";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connection();

    const tran = await WalletTranz.findById(params.id);
    return new NextResponse(JSON.stringify(tran), {
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
    const { date, qty } = body;

    const tran = (await WalletTranz.findByIdAndUpdate(
      params.id,
      {
        $set: {
          date,
        },
        $inc: {
          qty,
        },
      },
      { new: true }
    )) as WalletTranzResponseType;
    if (qty != 0) {
      const balance = qty * (tran.type == 1 ? 1 : -1);

      await CryptoWallet.findOneAndUpdate(
        {
          username: tran.username,
          coin: tran.coin,
        },
        {
          $inc: {
            balance,
          },
        }
      );
    }
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
