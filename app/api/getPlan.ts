import {
  InvestmentMassEmailProp,
  InvestmentPlanResponseType,
  InvestmentResponseType,
  UpdateProp,
  UserResponseType,
} from "../components/js/dataTypes";
import { investmentCapitalMessage } from "../components/js/emails";
import sendMassMail from "../components/js/sendMail";
import Investment from "../components/models/Investment";
import InvestmentPlan from "../components/models/InvestmentPlan";
import Transaction from "../components/models/Transaction";
import User from "../components/models/User";
const dayInMilliSec = 86400000;
export default async function getPlan(amount: number, _id?: string) {
  const plan = _id
    ? await InvestmentPlan.findOne({
        minimum: { $lte: amount },
        maximum: { $gte: amount },
        _id,
      })
    : await InvestmentPlan.findOne({
        minimum: { $lte: amount },
        maximum: { $gte: amount },
      });
  return plan._doc as InvestmentPlanResponseType;
}
export async function getPlanWithId(id: string) {
  const plan = await InvestmentPlan.findById(id);
  return plan._doc as InvestmentPlanResponseType;
}
const stillActive = (
  investment: InvestmentResponseType,
  plan: InvestmentPlanResponseType
): { active: boolean; payCapital: boolean } => {
  const expireDate =
    new Date(investment.activeDate).getTime() + plan.duration * dayInMilliSec;
  const capitalDate = plan.share
    ? investment.lastPayDate + plan.capitalPayment * dayInMilliSec
    : new Date(investment.activeDate).getTime() +
      plan.capitalPayment * dayInMilliSec;

  const now = new Date().getTime();

  return {
    active: now < expireDate,
    payCapital: now >= capitalDate,
  };
};
export const updateInvestment = async (
  investments: InvestmentResponseType[]
): Promise<UpdateProp> => {
  const valid: InvestmentResponseType[] = [];
  const invalid: InvestmentResponseType[] = [];
  const emails: InvestmentMassEmailProp[] = [];
  const InvestmentPlans = await InvestmentPlan.find();

  for (let i = 0; i < investments.length; i++) {
    const plan = InvestmentPlans.find(
      (pla) => pla.id == investments[i].plan
    ) as InvestmentPlanResponseType;
    const investment = investments[i];
    if (investment.capitalPaid && investment.expired) invalid.push(investment);
    else {
      const { active, payCapital } = stillActive(investment, plan);
      const totalInterest = investment.amount * plan.interest;

      if (
        (!active && investment.active) ||
        (payCapital && !investment.capitalPaid)
      ) {
        const interestBalance =
          !active && investment.active ? totalInterest : 0;
        const capital =
          payCapital && !investment.capitalPaid ? investment.amount : 0;
        const share = totalInterest;

        let amount = plan.share ? share : interestBalance + capital;
        const lastPayDate = new Date().getTime();
        const upInvestment = await Investment.findByIdAndUpdate(
          investment._id,
          plan.share
            ? {
                $set: {
                  lastPayDate,
                  interestBalance: 0,
                },
              }
            : {
                $set: {
                  active,
                  expired: payCapital,
                  interestBalance: 0,
                  capitalPaid: payCapital,
                  lastPayDate,
                },
              },
          { new: true }
        );
        invalid.push(upInvestment);

        const user = (await User.findOneAndUpdate(
          { username: investment.username },
          {
            $inc: {
              balance: amount,
            },
          }
        )) as UserResponseType;
        ((plan.share && payCapital) || (!active && investment.active)) &&
          emails.push({ email: user.email, investment, name: user.username });
      } else {
        active ? valid.push(investment) : invalid.push(investment);
      }
    }
  }
  if (emails.length > 0) {
    await sendMassMail(investmentCapitalMessage(emails));
  }
  return { valid, invalid };
};
export const checkTenure = async (tenure = 3, tokenUser: UserResponseType) => {
  const investments = await Investment.find({
    username: tokenUser.username,
  })
    .sort({ _id: -1 })
    .limit(tenure);
  let good = true;
  if (investments.length == tenure) {
    const transactions = await Transaction.find({
      username: tokenUser.username,
      type: 1,
      status: 1,
      network: { $not: /AG/ },
    })
      .sort({ _id: -1 })
      .limit(1);
    if (transactions.length == 0) {
      good = false;
      return good;
    }
    const tranDate = new Date(transactions[0].createdAt);
    const dateVal = tranDate.getTime();
    const invDate = new Date(investments[tenure - 1].createdAt);
    const invDateVal = invDate.getTime();
    if (invDateVal > dateVal) good = false;
  }
  return good;
};

export const calUserBalance = async (
  investments: InvestmentResponseType[],
  username: string
) => {
  const user = (await User.findOne({
    username,
  })) as UserResponseType;
  const plans = (await InvestmentPlan.find()) as InvestmentPlanResponseType[];
  let userBal = user.balance;
  let userpending = user.pending;
  investments.forEach((investment) => {
    const plan = plans.find((e) => e._id == investment.plan)!;
    const totalInterest = plan.interest * investment.amount;
    const today = new Date();
    const activeDate = new Date(
      plan.share ? investment.lastPayDate : investment.activeDate
    );
    const todayVal = today.getTime();
    const exVal =
      activeDate.getTime() +
      (plan.share ? plan.capitalPayment : plan.duration) * dayInMilliSec;
    const daysLeft = exVal > todayVal ? (exVal - todayVal) / dayInMilliSec : 0;
    const daysGone =
      (plan.share ? plan.capitalPayment : plan.duration) - daysLeft;
    const centage =
      daysGone / (plan.share ? plan.capitalPayment : plan.duration);
      
      
    userpending += investment.active
      ? centage * totalInterest + investment.amount
      : investment.amount;
  });
  return { balance: userBal, pending: userpending };
};
