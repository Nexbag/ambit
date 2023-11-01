"use client";
import { useEffect, useState } from "react";

import styles from "../styles.module.scss";

import Link from "next/link";
import { useUserContext } from "@/app/components/js/Wrapper";
import { InvestmentPlanResponseType } from "@/app/components/js/dataTypes";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import { investmentPlanUrl } from "@/app/components/js/config";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Paginate from "@/app/components/js/pager/Paginate";
export const Plans: React.FC<{
  investmentPlans: InvestmentPlanResponseType[];
}> = ({ investmentPlans: data }) => {
  const context = useUserContext();
  const user = context?.user;

  const [investmentPlans, setInvestmentPlans] =
    useState<InvestmentPlanResponseType[]>(data);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [duration, setDuration] = useState<number>(7);
  const [interest, setInterest] = useState<number>(0.27);
  const [minimum, setMinimum] = useState<number>(300);
  const [maxTenure, setMaxTenure] = useState<number>(3);
  const [maximum, setMaximum] = useState<number>(5000);
  const [refCommission, setRefCommission] = useState<number>(0.04);
  const [capitalPayment, setCapitalPayment] = useState<number>(7);
  const [share, setShare] = useState<boolean>(false);

  const handleCreate = async () => {
    setError("Please wait ...");
    const { data, message, success } = await postRequest(
      investmentPlanUrl,
      {
        name,
        duration,
        interest,
        minimum,
        capitalPayment,
        share,
        maximum,

        refCommission,
        maxTenure,
      },
      user?.token
    );
    success && setInvestmentPlans((e) => [data, ...e]);
    showError(setError, message);
  };

  return (
    <div className={styles.main}>
      <h1>Investment Plans</h1>
      <div className={styles.container}>
        <form id="form">
          <h2>Create Investment Package</h2>
          <label htmlFor="Name">Investment Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(() => e.target.value)}
          />

          <label htmlFor="duration">Duration In Days</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(() => parseInt(e.target.value))}
          />
           <label>Capital Withdrawal</label>
          <input
            type="number"
            value={capitalPayment}
            onChange={(e) => setCapitalPayment(() => parseInt(e.target.value))}
          />
          <label htmlFor="Interest">Interest</label>
          <input
            type="number"
            value={interest}
            onChange={(e) => setInterest(() => parseFloat(e.target.value))}
          />
          <span style={{ color: "var(--s)" }}>
            That will be {interest * 100}% interest.
          </span>
          <label>Referral Commission</label>
          <input
            type="number"
            value={refCommission}
            onChange={(e) => setRefCommission(() => parseFloat(e.target.value))}
          />
          <span style={{ color: "var(--s)" }}>
            That will be {refCommission * 100}% referral commission.
          </span>
          <label htmlFor="Minimum">Minimum Amount To Invest</label>
          <input
            type="number"
            value={minimum}
            onChange={(e) => setMinimum(() => parseInt(e.target.value))}
          />
          <label htmlFor="Maximum">Maximum Amount To Invest</label>
          <input
            type="number"
            value={maximum}
            onChange={(e) => setMaximum(() => parseInt(e.target.value))}
          />
          <label>Maximum Reinvestment</label>
          <input
            type="number"
            value={maxTenure}
            onChange={(e) => setMaxTenure(() => parseInt(e.target.value))}
          />
         
          <label>Plan Type</label>
          <select
            value={share ? "true" : "false"}
            onChange={(e) => setShare(() => e.target.value == "true")}
          >
            <option value="true">Share</option>
            <option value="false">Regular</option>
          </select>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            Create
          </button>
        </form>

        <div className={styles.table}>
          <h1>Investment Packages</h1>

          <div className={styles.row}>
            <span>Plan Name</span>
            <span>Activity</span>
            <span>Minimum Deposit</span>
            <span>Maximum Deposit</span>
            <span>Action</span>
          </div>
          {investmentPlans.map((plan) => (
            <div key={plan._id} className={styles.row}>
              <span>{plan.name}</span>
              <span>{!plan.hidden ? "Active" : "Inactive"}</span>
              <span>${plan.minimum.toLocaleString("USA")}</span>
              <span>${plan.maximum.toLocaleString("USA")}</span>
              <Link
                className={"action2"}
                href={`/dashboard/investments/plans/${plan._id}`}
              >
                View
              </Link>
            </div>
          ))}
          {investmentPlans.length == 0 && <h1>No Investment Plans</h1>}
          <Paginate data={data} setData={setInvestmentPlans} />
        </div>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};
export const UpdatePlan: React.FC<{
  plan: InvestmentPlanResponseType;
}> = ({ plan: selInvestmentPlan }) => {
  const context = useUserContext();
  const user = context?.user;

  const [error, setError] = useState<string>("");

  const [duration, setDuration] = useState<number>(7);
  const [interest, setInterest] = useState<number>(0.5);
  const [minimum, setMinimum] = useState<number>(300);
  const [maximum, setMaximum] = useState<number>(5000);
  const [hidden, setHidden] = useState<boolean>(false);
  const [refCommission, setRefCommission] = useState<number>(0.1);
  const [capitalPayment, setCapitalPayment] = useState<number>(7);
  const [share, setShare] = useState<boolean>(false);
  const [maxTenure, setMaxTenure] = useState<number>(3);
  const handleUpdate = async (id: string = selInvestmentPlan!._id) => {
    setError("Please wait ...");

    const { success, message } = await putRequest(
      `${investmentPlanUrl}${id}`,
      {
        duration,
        interest,
        maxTenure,
        minimum,
        capitalPayment,
        maximum,
        hidden,
        share,
        refCommission,
      },
      user?.token
    );
    success && location.replace("/dashboard/investments/plans");
    showError(setError, message);
  };

  useEffect(() => {
    if (selInvestmentPlan) {
      setDuration(() => selInvestmentPlan.duration);
      setInterest(() => selInvestmentPlan.interest);
      setMinimum(() => selInvestmentPlan.minimum);
      setCapitalPayment(() => selInvestmentPlan.capitalPayment);
      setMaximum(() => selInvestmentPlan.maximum);
      setHidden(() => selInvestmentPlan.hidden);
      setRefCommission(() => selInvestmentPlan.refCommission);
      setMaxTenure(() => selInvestmentPlan.maxTenure);
      setShare(() => selInvestmentPlan.share);
    }
  }, [selInvestmentPlan._id]);

  return (
    <div className={styles.main}>
      <h1>Update {selInvestmentPlan.name}</h1>
      <div className={styles.box}>
        <form id="form">
          <h2>Create Investment Package</h2>
          <label htmlFor="Name">Investment Name</label>
          <input type="text" defaultValue={selInvestmentPlan.name} disabled />

          <label htmlFor="duration">Duration In Days</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(() => parseInt(e.target.value))}
          />
           <label>Capital Withdrawal</label>
          <input
            type="number"
            value={capitalPayment}
            onChange={(e) => setCapitalPayment(() => parseInt(e.target.value))}
          />
          <label htmlFor="Interest">Interest</label>
          <input
            type="number"
            value={interest}
            onChange={(e) => setInterest(() => parseFloat(e.target.value))}
          />
          <span style={{ color: "var(--s)" }}>
            That will be {interest * 100}% interest.
          </span>
          <label>Referral Commission</label>
          <input
            type="number"
            value={refCommission}
            onChange={(e) => setRefCommission(() => parseFloat(e.target.value))}
          />
          <span style={{ color: "var(--s)" }}>
            That will be {refCommission * 100}% referral commission.
          </span>
          <label htmlFor="Minimum">Minimum Amount To Invest</label>
          <input
            type="number"
            value={minimum}
            onChange={(e) => setMinimum(() => parseInt(e.target.value))}
          />
          <label htmlFor="Maximum">Maximum Amount To Invest</label>
          <input
            type="number"
            value={maximum}
            onChange={(e) => setMaximum(() => parseInt(e.target.value))}
          />
          <label>Maximum Reinvestment</label>
          <input
            type="number"
            value={maxTenure}
            onChange={(e) => setMaxTenure(() => parseInt(e.target.value))}
          />
         
          <label>Plan Type</label>
          <select
            value={share ? "true" : "false"}
            onChange={(e) => setShare(() => e.target.value == "true")}
          >
            <option value="true">Share</option>
            <option value="false">Regular</option>
          </select>
          <label>Allow Investments</label>
          <select
            value={hidden ? "true" : "false"}
            onChange={(e) => setHidden(() => e.target.value == "true")}
          >
            <option value="true">Hide Plan</option>
            <option value="false">Allow Investment</option>
          </select>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            Update
          </button>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Plans;
