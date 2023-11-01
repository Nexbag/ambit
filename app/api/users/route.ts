import connection from "@/app/components/js/connection";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";
import verifyToken, { makeToken } from "@/app/components/js/token";

export const GET = async (req: Request) => {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    if (username) {
      const users = await User.aggregate([
        {
          $match: {
            username: {
              $regex: username,
              $options: "i",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $limit: 10,
        },
      ]);
      return new NextResponse(JSON.stringify(users), {
        status: 200,
      });
    }
    if (!tokenUser.admin) throw new Error();

    const users = await User.find().sort({ _id: -1 });

    return new NextResponse(JSON.stringify(users), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Failed" }), {
      status: 401,
    });
  }
};

export const PUT = async (req: Request) => {
  try {
    await connection();
    const bodyRequest = await req.json();
    const tokenUser = verifyToken(req.headers.get("token") || "");
    const { verifyEmail } = bodyRequest;

    const emailUser = await User.findByIdAndUpdate(
      tokenUser._id,
      { $set: { verified: verifyEmail } },
      {
        new: true,
      }
    );

    const uzer = makeToken(emailUser._doc);

    return new NextResponse(JSON.stringify(uzer), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
};
