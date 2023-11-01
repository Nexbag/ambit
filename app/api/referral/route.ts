import connection from "@/app/components/js/connection";
import {
  ReferralResponseType,
  ReferralTransactionResponseType,
} from "@/app/components/js/dataTypes";
import verifyToken from "@/app/components/js/token";
import Referral from "@/app/components/models/Referral";
import ReferralTransaction from "@/app/components/models/ReferralTransaction";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const calTotal = (
      tranz: ReferralTransactionResponseType[],
      referrals: ReferralResponseType[]
    ) => {
      let total = 0;
      tranz.forEach((e) => {
        total += e.amount;
      });

      const refs = referrals.map((ref) => {
        const found = tranz.filter((tran) => tran.username == ref.username);
        let amount = 0;
        found.forEach((tran) => (amount += tran.amount));
        const modTran: ReferralTransactionResponseType = {
          _id: ref._id,
          __v: ref.__v,
          amount,
          createdAt: ref.createdAt,
          rUsername: ref.rUsername,
          transactionId: "38jfjjf3",
          updatedAt: ref.updatedAt,
          username: ref.username,
        };
        return modTran;
      });
      return { total, transactions: refs };
    };
    if (tokenUser.admin) {
      if (username) {
        const all = await Referral.find({
          rUsername: username,
        }).sort({ _id: -1 });
        const allTranz = await ReferralTransaction.find({
          rUsername: username,
        }).sort({ _id: -1 });
        const { total, transactions } = calTotal(allTranz, all);
        return new NextResponse(
          JSON.stringify({ referrals: all, transactions, total }),
          {
            status: 200,
          }
        );
      }
      const all = await Referral.find().sort({ _id: -1 });
      const allTranz = await ReferralTransaction.find().sort({ _id: -1 });
      const { total, transactions } = calTotal(allTranz, all);
      return new NextResponse(
        JSON.stringify({ referrals: all, transactions, total }),
        {
          status: 200,
        }
      );
    } else {
      const all = await Referral.find({ rUsername: tokenUser.username }).sort({
        _id: -1,
      });
      const allTranz = await ReferralTransaction.find({
        rUsername: tokenUser.username,
      }).sort({ _id: -1 });
      const { total, transactions } = calTotal(allTranz, all);
      return new NextResponse(
        JSON.stringify({ referrals: all, transactions, total }),
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
