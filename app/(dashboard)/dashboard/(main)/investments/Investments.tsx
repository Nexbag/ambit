"use client";

import { useState } from "react";

import styles from "./styles.module.scss";

import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  InvestmentPlanResponseType,
  InvestmentResponseType,
} from "@/app/components/js/dataTypes";
import { investmentUrl } from "@/app/components/js/config";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Paginate from "@/app/components/js/pager/Paginate";
import { useRouter } from "next/navigation";

export const AllInvestments: React.FC<{
  investments: InvestmentResponseType[];
}> = ({ investments: data }) => {
  const context = useUserContext();
  const user = context?.user;

  const [investments, setInvestments] =
    useState<InvestmentResponseType[]>(data);

  return (
    <div className={styles.main}>
      <h1>Investments</h1>
      <div
        className={styles.container}
        style={{ flexDirection: "row", gap: "10px" }}
      >
        {user?.admin && (
          <Link href={"/dashboard/investments/plans"} className="action2">
            Manage Packages
          </Link>
        )}
      </div>
      <div className={styles.table}>
        {investments.length < 1 && <h1>No investment found!</h1>}
        <div className={styles.row}>
          <span>Active Date</span>
          <span>Plan</span>
          {user?.admin && <span>Username</span>}
          <span>Amount</span>
          <span>Activity</span>
          <span>Action</span>
        </div>

        {investments.map((investment) => {
          const date = new Date(investment.activeDate);

          return (
            <div className={styles.row} key={investment._id}>
              <span>{date.toDateString()}</span>
              <span>{investment.planName}</span>
              {user?.admin && <span>{investment.username.toUpperCase()}</span>}
              <span>${investment.amount.toLocaleString("USA")}</span>
              <span>{investment.active ? "Active" : "Inactive"}</span>

              <Link
                href={`/dashboard/investments/${investment._id}`}
                className={"action2"}
              >
                Details
              </Link>
            </div>
          );
        })}
      </div>

      <Paginate data={data} setData={setInvestments} />
    </div>
  );
};
export const Invest: React.FC<{
  plan: InvestmentPlanResponseType;
}> = ({ plan }) => {
  const context = useUserContext();
  const user = context?.user;
  const [amount, setAmount] = useState<number>(plan.minimum);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const handleCreate = async () => {
    setError("Please wait...");
    const { success, message } = await postRequest(
      investmentUrl,
      { amount, id: plan._id },

      user?.token
    );

    success && router.replace("/dashboard/investments/history");
    showError(setError, message);
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <h1>Invest</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <h3>
            Invest In {plan.name} and earn {(plan.interest * 100).toLocaleString("USA")}% interest after{" "}
            {plan.duration} days.
          </h3>
          <label htmlFor="Amount">Amount to invest</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(() => parseInt(e.target.value))}
          />

          <span style={{ color: "var(--s)" }}>
            {amount > (user?.balance || 0)
              ? `Insufficient funds, please top up your account to continue.`
              : `You will be getting $${(
                  amount +
                  plan.interest * amount
                ).toLocaleString("USA")}  as total  ROI after ${
                  plan.duration
                } day(s).`}
          </span>

          <button
            disabled={
              amount > (user?.balance || 0) ||
              amount < plan.minimum ||
              amount > plan.maximum
            }
          >
            Invest Now
          </button>
          <div className={styles.fRow}>
            <label htmlFor="">Minimum Amount</label>
            <span>${plan.minimum.toLocaleString("USA")}</span>
          </div>
          <div className={styles.fRow}>
            <label htmlFor="">Maximum Amount</label>
            <span>${plan.maximum.toLocaleString("USA")}</span>
          </div>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const ViewInvestment: React.FC<{
  investment: InvestmentResponseType;
  plan: InvestmentPlanResponseType;
}> = ({ investment, plan }) => {
  const context = useUserContext();
  const user = context?.user;

  const date = new Date(investment.activeDate);

  const expire = new Date(date.getTime() + plan.duration * 86400000);

  const [error, setError] = useState<string>("");
  const activeDate = date.toDateString();
  const expireDate = expire.toDateString();
  const router = useRouter();
  const handleReinvestment = async (reinvest: number) => {
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${investmentUrl}${investment?._id}`,
      { reinvest },

      user?.token
    );

    success && router.replace("/dashboard/investments/history");
    showError(setError, message);
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <h1>Manage Investment</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={styles.iRow}>
            <label htmlFor="">Investor Name</label>
            <span>{investment.username.toUpperCase()}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Amount</label>
            <span>${investment.amount.toLocaleString("en-US")} </span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Investment Date</label>
            <span>{activeDate}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Activation Date</label>
            <span>{activeDate}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Ends On</label>
            <span>{expireDate}</span>
          </div>
          <div className={styles.iRow}>
            <label htmlFor="">Investment Status</label>
            <span>{investment.active ? "Active" : "Inactive"}</span>
          </div>

          <div>
            <h1>_________________</h1>
          </div>

          {investment.capitalPaid && !user?.admin && (
            <div>
              <button
                onClick={() => {
                  handleReinvestment(1);
                }}
                disabled={investment.active}
              >
                Reinvest Capital
              </button>
              <button
                onClick={() => {
                  handleReinvestment(2);
                }}
                disabled={investment.active}
              >
                Reinvest Capital + Interest
              </button>
            </div>
          )}
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const PlanList: React.FC<{
  plans: InvestmentPlanResponseType[];
}> = ({ plans: data }) => {
  const [plans, setPlans] = useState<InvestmentPlanResponseType[]>(data);

  return (
    <div className={styles.main}>
      <h1>Start Investing</h1>

      <div className={styles.grid}>
        {plans.length < 1 && (
          <h1>No investment package available at the moment</h1>
        )}

        {plans.map((plan) => (
          <div className={styles.plan} key={plan._id}>
            <div className={styles.under}>
              <h2>{plan.name}</h2>
              <div>
                <span>Minimum</span>
                <p>${plan.minimum.toLocaleString("USA")} </p>
              </div>
              <div>
                <span>Maximum</span>
                <p>${plan.maximum.toLocaleString("USA")} </p>
              </div>
              <div>
                <span>Duration</span>
                <p>{plan.duration} Days</p>
              </div>
              <div>
                <span>Interest</span>
                <p>{(plan.interest * 100).toLocaleString("USA")}%</p>
              </div>
              <div>
                <span>Capital Payment</span>
                <p>{plan.capitalPayment} Day(s)</p>
              </div>
              <Link
                className={"action2"}
                href={`/dashboard/investments/invest?id=${plan._id}`}
              >
                Invest
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Paginate data={data} setData={setPlans} />
    </div>
  );
};

export default AllInvestments;
