import { NextResponse } from "next/server";
import connection from "@/app/components/js/connection";
import verifyToken from "@/app/components/js/token";
import User from "@/app/components/models/User";
import Transaction from "@/app/components/models/Transaction";
import sendMassMail from "@/app/components/js/sendMail";
import {
  refTransactionMessage,
  transactionEndMessage,
  transferEndMessage,
  transferFailMessage,
} from "@/app/components/js/emails";
import {
  TransactionResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
import ReferralTransaction from "@/app/components/models/ReferralTransaction";
import getPlan from "../../getPlan";

export const PUT = async (req: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(req.headers.get("token") || "");
    const body = await req.json();

    const { status, transfer } = body;
    const _id = params.id;
    if (status == 0)
      return new NextResponse(
        JSON.stringify({ message: "Status must be different" }),
        { status: 401 }
      );
    if (!tokenUser.admin) throw new Error();
    if (transfer) {
      const transactionSender = (await Transaction.findOneAndUpdate(
        { _id, network: "AG" },
        { $set: { status: transfer } }
      )) as TransactionResponseType;
      if (
        !transactionSender ||
        transfer == transactionSender.status ||
        transactionSender.type == 1
      )
        return new NextResponse(
          JSON.stringify({ message: "Transaction not found" }),
          { status: 401 }
        );
      if (transfer != 1) {
        const sender = await User.findOneAndUpdate(
          { username: transactionSender.username },
          {
            $inc: { balance: transactionSender.amount },
          },
          { new: true }
        );
        if (transactionSender.status == 1) {
          const receiver = await User.findOneAndUpdate(
            { username: transactionSender.wallet },
            {
              $inc: { balance: transactionSender.amount * -1 },
            },
            { new: true }
          );
          await Transaction.findOneAndDelete({
            amount: transactionSender.amount,
            type: 1,
            status: 1,
            network: "AG",
            username: receiver.username,
            wallet: sender.username,
          });
        }
        await sendMassMail(
          transferFailMessage(sender._doc, transactionSender.amount)
        );
        return new NextResponse(JSON.stringify({ message: "Success" }), {
          status: 200,
        });
      }
      const sender = await User.findOne({
        username: transactionSender.username,
      });
      const receiver = await User.findOneAndUpdate(
        { username: transactionSender.wallet },
        {
          $inc: { balance: transactionSender.amount },
        },
        { new: true }
      );
      await new Transaction({
        amount: transactionSender.amount,
        type: 1,
        status: 1,
        network: "AG",
        username: receiver.username,
        wallet: sender.username,
      }).save();
      await sendMassMail(
        transferEndMessage(sender._doc, receiver._doc, transactionSender.amount)
      );

      return new NextResponse(JSON.stringify({ message: "Success" }), {
        status: 200,
      });
    }
    const trans = await Transaction.findOneAndUpdate(
      { _id, network: { $not: /AG/ } },
      {
        $set: { status },
      }
    );
    const transaction = trans._doc as TransactionResponseType;

    if (!transaction || transaction.status == status)
      return new NextResponse(JSON.stringify({ message: "Not found" }), {
        status: 401,
      });

    let amount = transaction.type == 0 ? 0 : transaction.amount;
    if (transaction.status == 1 && status != 1) {
      amount =
        transaction.type == 1 ? transaction.amount * -1 : transaction.amount;
    }
    if (transaction.status == -1 && status == 1) {
      amount =
        transaction.type == 1 ? transaction.amount : transaction.amount * -1;
    }
    if (transaction.status == 0 && status == -1) {
      amount = transaction.type == 1 ? 0 : transaction.amount;
    }

    const user = (await User.findOneAndUpdate(
      { username: transaction.username },
      { $inc: { balance: amount } }
    )) as UserResponseType;
    if (user.referredBy && transaction.type == 1) {
      const plan = await getPlan(amount);
      const rUser = await User.findOneAndUpdate(
        {
          username: user.referredBy,
          disabled: false,
        },
        { $inc: { balance: amount * plan.refCommission * status } }
      );

      rUser &&
        status == 1 &&
        (await new ReferralTransaction({
          username: user.username,
          amount: amount * plan.refCommission,
          transactionId: transaction._id,
          rUsername: user.referredBy,
        }).save());
      rUser &&
        status != 1 &&
        (await ReferralTransaction.findOneAndDelete({
          username: user.username,
          transactionId: transaction._id,
          rUsername: user.referredBy,
        }));
      rUser &&
        status == 1 &&
        (await sendMassMail(
          refTransactionMessage(user, rUser, amount * plan.refCommission)
        ));
    }
    transaction.status = status;

    await sendMassMail(transactionEndMessage(user, transaction));

    return new NextResponse(JSON.stringify(transaction), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
};

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connection();

    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    const transactionData = tokenUser.admin
      ? await Transaction.findById(params.id)
      : await Transaction.findOne({
          username: tokenUser.username,
          _id: params.id,
        });

    return new NextResponse(JSON.stringify(transactionData), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "failed" }), {
      status: 401,
    });
  }
}
