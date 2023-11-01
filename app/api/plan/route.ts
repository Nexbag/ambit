import verifyToken from "@/app/components/js/token";
import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import InvestmentPlan from "@/app/components/models/InvestmentPlan";

export async function POST(req: Request) {
  try {
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    if (!tokenUser.admin) throw new Error();
    const body = await req.json();
    await connection();
    const plan = await InvestmentPlan.create(body);
    return new NextResponse(JSON.stringify(plan), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}

export async function GET(req: Request) {
  try {
    await connection();
    const url = new URL(req.url);
    const share = url.searchParams.get("share");
    const all = url.searchParams.get("all");
    if (share) {
      const plans = await InvestmentPlan.find({
        share: true,
        hidden: false,
      });

      return new NextResponse(JSON.stringify(plans), {
        status: 200,
      });
    }
    if (all) {
      const tokenUser = verifyToken(`${req.headers.get("token")}`);
      if (!tokenUser.admin) throw new Error();
      const plans = await InvestmentPlan.find().sort({ _id: -1 });

      return new NextResponse(JSON.stringify(plans), {
        status: 200,
      });
    } else {
      const plans = await InvestmentPlan.find({ hidden: false });
      return new NextResponse(JSON.stringify(plans), {
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}
