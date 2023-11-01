import { KYCResponseType } from "@/app/components/js/dataTypes";
import { KYCMessage } from "@/app/components/js/emails";
import sendMassMail from "@/app/components/js/sendMail";
import verifyToken from "@/app/components/js/token";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import Kyc from "@/app/components/models/Kyc";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const { status } = await req.json();

    if (!tokenUser.admin || status == 0) {
      throw new Error("Not admin");
    }
    const kyc = (await Kyc.findByIdAndUpdate(
      params.id,
      {
        $set: {
          status,
        },
      },
      { new: true }
    )) as KYCResponseType;
    const user = await User.findOneAndUpdate(
      { username: kyc.username },
      { $set: { kyc: status == 1 } }
    );
    await sendMassMail(KYCMessage(user._doc, status));
    return new NextResponse(JSON.stringify({ user, kyc }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized!" }), {
      status: 401,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connection();
    verifyToken(`${req.headers.get("token")}`);
    const kyc = await Kyc.findById(params.id);
    return new NextResponse(JSON.stringify(kyc), {
      status: kyc == null ? 401 : 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    if (!tokenUser.admin) throw new Error();
    await Kyc.findByIdAndDelete(params.id);
    return new NextResponse(JSON.stringify({ message: "Successful" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
