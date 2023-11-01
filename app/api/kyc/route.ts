import { KYCMessageAdmin } from "@/app/components/js/emails";
import sendMassMail from "@/app/components/js/sendMail";
import verifyToken from "@/app/components/js/token";
import { NextResponse } from "next/server";
import Kyc from "@/app/components/models/Kyc";
import connection from "@/app/components/js/connection";

export async function POST(req: Request) {
  try {
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const body = await req.json();

    body.approved = false;
    body.username = tokenUser.username;
    await connection();
    await new Kyc(body).save();
    await sendMassMail(KYCMessageAdmin());

    return new NextResponse(
      JSON.stringify({
        message: "Your information has been securely submitted.",
      }),
      {
        status: 200,
      }
    );
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
    const username = url.searchParams.get("username");
    const status = url.searchParams.get("status");
    if (tokenUser.admin) {
      if (status && username) {
        const kycs = await Kyc.find({ status, username }).sort({ _id: -1 });
        return new NextResponse(JSON.stringify(kycs), {
          status: 200,
        });
      }
      if (status) {
        const kycs = await Kyc.find({ status }).sort({ _id: -1 });
        return new NextResponse(JSON.stringify(kycs), {
          status: 200,
        });
      }
      if (username) {
        const kycs = await Kyc.find({ username }).sort({ _id: -1 });
        return new NextResponse(JSON.stringify(kycs), {
          status: 200,
        });
      } else {
        const kycs = await Kyc.find().sort({ _id: -1 });
        return new NextResponse(JSON.stringify(kycs), {
          status: 200,
        });
      }
    } else {
      if (status) {
        const kycs = await Kyc.find({
          status,
          username: tokenUser.username,
        });
        return new NextResponse(JSON.stringify(kycs), {
          status: 200,
        });
      } else {
        const kycs = await Kyc.find({ username });
        return new NextResponse(JSON.stringify(kycs), {
          status: 200,
        });
      }
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}
