import verifyToken from "@/app/components/js/token";
import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import InvestmentPlan from "@/app/components/models/InvestmentPlan";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const body = await req.json();
    if (!tokenUser.admin) throw new Error();

    const plan = await InvestmentPlan.findByIdAndUpdate(
      params.id,
      {
        $set: body,
      },
      { new: true }
    );
    return new NextResponse(JSON.stringify(plan), {
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

    const plan = await InvestmentPlan.findById(params.id);

    return new NextResponse(JSON.stringify(plan), {
      status: plan == null ? 401 : 200,
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
    if (!tokenUser.admin) throw new Error();

    await InvestmentPlan.findByIdAndUpdate(params.id, {
      $set: { hidden: true },
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
