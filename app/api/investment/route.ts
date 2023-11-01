import connection from "@/app/components/js/connection";
import {
  InvestmentResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
import { investmentStartMessage } from "@/app/components/js/emails";
import sendMassMail from "@/app/components/js/sendMail";
import verifyToken from "@/app/components/js/token";
import Investment from "@/app/components/models/Investment";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";
import getPlan, {
  calUserBalance,
  checkTenure,
  updateInvestment,
} from "../getPlan";

export async function POST(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    const { amount, id } = await req.json();
    const plan = await getPlan(amount, id);
    if (plan.hidden)
      return new NextResponse(
        JSON.stringify({
          message: "Not allowed",
        }),
        {
          status: 401,
        }
      );
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

    const activeDate = new Date();

    const user = (await User.findOneAndUpdate(
      { _id: tokenUser._id, balance: { $gte: amount } },
      { $inc: { balance: amount * -1 } }
    )) as UserResponseType;

    if (!user) throw new Error("No User");

    const investment = await new Investment({
      username: tokenUser.username,
      plan: plan._id,
      activeDate,
      lastPayDate: activeDate,
      planName: plan.name,
      amount,
      tenure: 1,
      initialAmount: amount,
    }).save();

    await sendMassMail(investmentStartMessage(user, investment._doc, plan));
    return new NextResponse(JSON.stringify({ message: "Created" }), {
      status: 201,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Some error occured" }), {
      status: 401,
    });
  }
}
export async function GET(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const active = url.searchParams.get("active");
    const all = url.searchParams.get("all");
    const capitalNotPaid = url.searchParams.get("capitalNotPaid");
    const capitalPaid = url.searchParams.get("capitalPaid");
    const balance = url.searchParams.get("balance");

    if (tokenUser.admin) {
      if (all) {
        const investments = await Investment.find();
        const { valid, invalid } = await updateInvestment(investments);

        return new NextResponse(JSON.stringify([...valid, ...invalid]), {
          status: 200,
        });
      }
      if (balance) {
        const investments = (await Investment.find({
          capitalPaid: false,
          username: balance,
        })) as InvestmentResponseType[];
        const bal = await calUserBalance(investments, balance);

        return new NextResponse(JSON.stringify(bal), {
          status: 200,
        });
      }
      if (capitalPaid) {
        const investments = await Investment.find({ capitalPaid });

        return new NextResponse(JSON.stringify(investments), {
          status: 200,
        });
      }
      if (capitalNotPaid) {
        const investments = await Investment.find({ capitalPaid: false });
        const { valid, invalid } = await updateInvestment(investments);
        return new NextResponse(
          JSON.stringify({
            investments: [...valid, ...invalid],
            balance: { pending: 0, balance: 0 },
          }),
          {
            status: 200,
          }
        );
      }
      if (username) {
        const investments = await Investment.aggregate([
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
        ]);
        return new NextResponse(JSON.stringify(investments), {
          status: 200,
        });
      }

      if (active) {
        const investments = await Investment.find({ active: true });
        const { valid } = await updateInvestment(investments);
        return new NextResponse(
          JSON.stringify({ investments: valid, balance: 0 }),
          {
            status: 200,
          }
        );
      } else {
        const investments = await Investment.find({ active: false });
        return new NextResponse(JSON.stringify(investments), {
          status: 200,
        });
      }
    } else {
      if (capitalPaid) {
        const investments = await Investment.find({
          username: tokenUser.username,
          capitalPaid,
        });
        return new NextResponse(JSON.stringify(investments), {
          status: 200,
        });
      }
      if (capitalNotPaid) {
        const investments = await Investment.find({
          capitalPaid: false,
          username: tokenUser.username,
        });
        const { valid, invalid } = await updateInvestment(investments);
        const bal = await calUserBalance(valid, tokenUser.username);
        return new NextResponse(
          JSON.stringify({ investments: [...valid, ...invalid], balance: bal }),
          {
            status: 200,
          }
        );
      }
      if (all) {
        const investments = await Investment.find({
          username: tokenUser.username,
        });
        const { valid, invalid } = await updateInvestment(investments);
        return new NextResponse(JSON.stringify([...valid, ...invalid]), {
          status: 200,
        });
      }

      if (active) {
        const investments = await Investment.find({
          active,
          expired: false,
          username: tokenUser.username,
        });
        const { valid } = await updateInvestment(investments);
        const bal = await calUserBalance(valid, tokenUser.username);
        return new NextResponse(
          JSON.stringify({ investments: valid, balance: bal }),
          {
            status: 200,
          }
        );
      } else {
        const investments = await Investment.find({
          active: false,
          username: tokenUser.username,
        });
        return new NextResponse(JSON.stringify(investments), {
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
