import connection from "@/app/components/js/connection";
import verifyToken, { makeToken } from "@/app/components/js/token";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const fUser = await User.findById(tokenUser._id);
    const user = makeToken(fUser._doc);
    if (user.disabled) throw new Error();

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Some error occured",
      }),
      { status: 401 }
    );
  }
}
