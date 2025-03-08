import verifyToken from "@/app/components/js/token";
import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import InvestmentPlan from "@/app/components/models/InvestmentPlan";
import Investment from "@/app/components/models/Investment";
import User from "@/app/components/models/User";
import {
  InvestmentPlanResponseType,
  InvestmentResponseType,
} from "@/app/components/js/dataTypes";
import getPlan, { checkTenure } from "../../getPlan";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const body = await req.json();

    const { reinvest } = body;
    const _id = params.id;

    const activeDate = new Date();
    const foundInvestment = (await Investment.findOne({
      _id,
      username: tokenUser.username,
      active: false,
      capitalPaid: true,
      expired: true,
    })) as InvestmentResponseType;
    const plan = (await InvestmentPlan.findById(
      foundInvestment.plan
    )) as InvestmentPlanResponseType;
    const good = await checkTenure(plan.maxTenure, tokenUser);
    if (!good)
      return new NextResponse(
        JSON.stringify({
          message: "You have to topup your account to continue",
        }),
        {
          status: 402,
        }
      );

    const amount =
      reinvest == 1
        ? foundInvestment.amount
        : foundInvestment.amount + foundInvestment.amount * plan.interest;
    const newPlan = await getPlan(amount);
    if (!newPlan) throw new Error();
    const user = await User.findOneAndUpdate(
      { username: tokenUser.username, balance: { $gte: amount } },
      { $inc: { balance: amount * -1 } }
    );
    if (!foundInvestment || !user)
      return new NextResponse(
        JSON.stringify({ message: "Insufficient funds" }),
        {
          status: 401,
        }
      );

    const investment = await new Investment({
      username: tokenUser.username,
      plan: newPlan._id,
      activeDate,
      amount,
      tenure: 1,
      lastPayDate: activeDate,
      initialAmount: amount,
      planName: plan.name,
    }).save();

    return new NextResponse(JSON.stringify(investment), {
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

    const foundInvestment = tokenUser.admin
      ? await Investment.findById(params.id)
      : await Investment.findOne({
          _id: params.id,
          username: tokenUser.username,
        });
    const plan = (await InvestmentPlan.findById(
      foundInvestment.plan
    )) as InvestmentPlanResponseType;

    return new NextResponse(
      JSON.stringify({ investment: foundInvestment, plan }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized!" }), {
      status: 401,
    });
  }
}
