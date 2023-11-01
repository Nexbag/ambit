import { NextResponse } from "next/server";
import verifyToken from "@/app/components/js/token";
import sendMassMail from "@/app/components/js/sendMail";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const tokenUser = async () => {
      try {
        const verified = verifyToken(req.headers.get("token") || "");
        return verified.admin;
      } catch (error) {
        return false;
      }
    };
    const admin = await tokenUser();
    if (body.pathName != "contact" && !admin) throw new Error();
    const sent = await sendMassMail(body);
    if (!sent) throw new Error();

    return new NextResponse(JSON.stringify({ message: "Sent" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Mail sending failed" }),
      {
        status: 401,
      }
    );
  }
};
