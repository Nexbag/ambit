import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import verifyToken from "@/app/components/js/token";
import User from "@/app/components/models/User";
import Transaction from "@/app/components/models/Transaction";
import sendMassMail from "@/app/components/js/sendMail";
import { transactionStartMessage } from "@/app/components/js/emails";
import { TransactionResponseType } from "@/app/components/js/dataTypes";

export const POST = async (req: Request) => {
  try {
    await connection();
    const tokenUser = verifyToken(req.headers.get("token") || "");
    const body = await req.json();
    body.status = 0;
    const { username } = tokenUser;
    const { amount, type, wallet, network, image } = body;
    if (amount < 0)
      return new NextResponse(
        JSON.stringify({ message: "Invalid value for amount" }),
        {
          status: 402,
        }
      );
    if (type == 0) {
      const user = await User.findOneAndUpdate(
        { username: tokenUser.username, balance: { $gte: amount } },
        { $inc: { balance: amount * -1 } }
      );
      if (!user)
        return new NextResponse(
          JSON.stringify({ message: "Insufficient funds" }),
          {
            status: 402,
          }
        );
    }
    const transaction = await new Transaction({
      amount,
      type,
      status: 0,
      network,
      username,
      image,
      wallet,
    }).save();
    await sendMassMail(transactionStartMessage(tokenUser, transaction._doc));

    return new NextResponse(JSON.stringify({ message: "success" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    let username = searchParams.get("username");
    const type = searchParams.get("type");
    const small = searchParams.get("small");
    username = username ? username.toLowerCase().trim() : username;
    const status = searchParams.get("status");

    const transfer = searchParams.get("transfer");
    await connection();

    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    if (type && username && status) {
      const transactionsData = !tokenUser.admin
        ? await Transaction.find({
            type,
            username: tokenUser.username,
            status,
          }).sort({ _id: -1 })
        : await Transaction.find({
            type,
            username,
            status,
            network: { $not: /HM/ },
          }).sort({ _id: -1 });

      return new NextResponse(JSON.stringify(transactionsData), {
        status: 200,
      });
    }
    if (username && type) {
      const foundTranz = tokenUser.admin
        ? await Transaction.aggregate([
            {
              $match: {
                username: {
                  $regex: username,
                  $options: "i",
                },
                type: type,
                network: { $not: /HM/ },
              },
            },

            {
              $sort: {
                _id: -1,
              },
            },
          ])
        : await Transaction.find({
            username: tokenUser.username,
            type,
          }).sort({ _id: -1 });

      return new NextResponse(JSON.stringify(foundTranz), {
        status: 200,
      });
    }
    if (username && status) {
      const transactionsData = tokenUser.admin
        ? await Transaction.find({
            username,
            status,
            network: { $not: /HM/ },
          }).sort({ _id: -1 })
        : await Transaction.find({
            username: tokenUser.username,
            status,
          }).sort({ _id: -1 });

      return new NextResponse(JSON.stringify(transactionsData), {
        status: 200,
      });
    }
    if (status && type) {
      const transactionsData = tokenUser.admin
        ? await Transaction.find({
            status,
            type,
            network: { $not: /HM/ },
          }).sort({ _id: -1 })
        : await Transaction.find({
            status,
            type,
            username: tokenUser.username,
          }).sort({ _id: -1 });

      return new NextResponse(JSON.stringify(transactionsData), {
        status: 200,
      });
    }
    if (type) {
      const transactionsData = !tokenUser.admin
        ? await Transaction.find({
            type,
            username: tokenUser.username,
          }).sort({ _id: -1 })
        : await Transaction.find({
            type,
            network: { $not: /HM/ },
          }).sort({ _id: -1 });

      return new NextResponse(JSON.stringify(transactionsData), {
        status: 200,
      });
    }
    if (small) {
      const transactionsData = tokenUser.admin
        ? ((await Transaction.find().sort({
            _id: -1,
          })) as TransactionResponseType[])
        : ((await Transaction.find({
            username: tokenUser.username,
          }).sort({ _id: -1 })) as TransactionResponseType[]);

      const small =
        transactionsData.length > 5
          ? transactionsData.splice(0, 5)
          : transactionsData;
      const success = transactionsData.filter((e) => e.status == 1);
      let withdrawal = 0;
      let deposit = 0;
      success.forEach((e) => {
        withdrawal += e.type == 0 ? e.amount : 0;
        deposit += e.type == 1 ? e.amount : 0;
      });
      const total = withdrawal + deposit;

      return new NextResponse(
        JSON.stringify({ transactions: small, deposit, withdrawal, total }),
        {
          status: 200,
        }
      );
    }

    if (transfer) {
      if (!tokenUser.admin) throw new Error();
      const transactionsData = await Transaction.find({
        network: "HM",
      }).sort({ _id: -1 });
      return new NextResponse(JSON.stringify(transactionsData), {
        status: 200,
      });
    }
    if (username) {
      const foundTranz = tokenUser.admin
        ? await Transaction.aggregate([
            {
              $match: {
                username: {
                  $regex: username,
                  $options: "i",
                },
                network: { $not: /HM/ },
              },
            },

            {
              $sort: {
                _id: -1,
              },
            },
          ])
        : await Transaction.find({
            username: tokenUser.username,
          }).sort({ _id: -1 });
      return new NextResponse(JSON.stringify(foundTranz), {
        status: 200,
      });
    }
    if (status) {
      const transactionsData = tokenUser.admin
        ? await Transaction.find({
            status,
            network: { $not: /HM/ },
          }).sort({ _id: -1 })
        : await Transaction.find({
            status,
            username: tokenUser.username,
          }).sort({ _id: -1 });
      return new NextResponse(JSON.stringify(transactionsData), {
        status: 200,
      });
    }

    const transactionsData = tokenUser.admin
      ? await Transaction.find({ network: { $not: /HM/ } }).sort({ _id: -1 })
      : await Transaction.find({ username: tokenUser.username }).sort({
          _id: -1,
        });

    return new NextResponse(JSON.stringify(transactionsData), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}
