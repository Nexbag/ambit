"use client";
import { useState, useEffect } from "react";
import styles from "./Calculator.module.scss";
import { InvestmentPlanResponseType } from "@/app/components/js/dataTypes";
const Calculator: React.FC<{ plans: InvestmentPlanResponseType[] }> = ({
  plans,
}): JSX.Element => {
  const [amount, setAmount] = useState<number>(0);
  const [selPlan, setSelPlan] = useState<InvestmentPlanResponseType>();

  useEffect(() => {
    setSelPlan(() => {
      const sel = plans.find(
        (plan) => amount <= plan.maximum && amount >= plan.minimum
      );
      return sel;
    });
  }, [amount]);
  return (
    <div className={styles.calculator}>
      <p>Plan calculator</p>
      <div className={styles.box}>
        <div className={styles.top}>
          <div className={styles.left}>
            {" "}
            <label htmlFor="amount">Enter Amount</label>
            <input
              type="number"
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              id="amount"
              value={amount}
            />
          </div>
          <div className={styles.right}>
            <label>Plan</label>
            <input disabled={true} value={selPlan?.name} />
          </div>
        </div>
        {selPlan == null ? (
          <span className={styles.error}>
            Our Investment plans starts from $
            {plans[0]?.minimum.toLocaleString("USA")}
          </span>
        ) : (
          <div className={styles.cal}>
            <h1>Summary</h1>
            <div className={styles.text}>
              <span>Plan</span>
              <span>{selPlan.name}</span>
            </div>
            <div className={styles.text}>
              <span>Duration</span>
              <span>{selPlan.duration} Day(s)</span>
            </div>
            <div className={styles.text}>
              <span>Interest Rate</span>
              <span>
                {((selPlan.interest * 100) / selPlan.duration).toLocaleString(
                  "USA"
                )}
                % daily
              </span>
            </div>
            <div className={styles.text}>
              <span>Total Interest</span>
              <span>{(selPlan.interest * 100).toLocaleString("USA")}%</span>
            </div>
            <div className={styles.text}>
              <span>Daily Interest</span>
              <span>
                $
                {(
                  (selPlan.interest * amount) /
                  selPlan.duration
                ).toLocaleString("USA")}
              </span>
            </div>
            <div className={styles.text}>
              <span>Total Interest</span>
              <span>${(selPlan.interest * amount).toLocaleString("USA")}</span>
            </div>
            <div className={styles.text}>
              <span>Total ROI</span>
              <span>
                ${(selPlan.interest * amount + amount).toLocaleString("USA")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
