"use client";
import Image from "next/image";
import styles from "./dashboard.module.scss";
import {
  InvestmentResponseType,
  TransactionResponseType,
} from "@/app/components/js/dataTypes";
import { useUserContext } from "@/app/components/js/Wrapper";
import { BiSolidStar } from "react-icons/bi";
import { BsStarHalf } from "react-icons/bs";
import { GoCodescanCheckmark } from "react-icons/go";
import { GiCancel } from "react-icons/gi";
import Link from "next/link";
import { MdOutlinePending } from "react-icons/md";

export default function Body({
  balance,
  pending,
  investments,
  transactions,
  deposit,
  withdrawal,
  total,
  totalRef,
}: {
  pending: number;
  balance: number;
  investments: InvestmentResponseType[];
  transactions: TransactionResponseType[];
  deposit: number;
  withdrawal: number;
  total: number;
  totalRef: number;
}) {
  const context = useUserContext();
  const user = context?.user;
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <div className={styles.balances}>
          <div className={styles.available}>
            <h2>${balance.toLocaleString("USA")}</h2>
            <p>Available Balance</p>
          </div>
          <div className={styles.pending}>
            <h2>${pending.toLocaleString("USA")}</h2>
            <p>System Balance</p>
          </div>
        </div>
        <div className={styles.intro}>
          <div className={styles.image}>
            <Image src={"/assets/ai.png"} fill alt="" />
          </div>
          {user && (
            <div className={styles.lower}>
              <h2>Welcome {user.username}</h2>
              <div>
                <span>Joined</span>
                <span>{user.createdAt.split("T")[0]}</span>
              </div>
              <div className={styles.ver}>
                <span>User Status</span>
                {user.verified ? (
                  <div className={styles.icons}>
                    <BiSolidStar />
                    <BiSolidStar />
                    <BiSolidStar />
                  </div>
                ) : (
                  <div className={styles.icons}>
                    <BiSolidStar />
                    <BiSolidStar />
                    <BsStarHalf />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <p>${deposit.toLocaleString("USA")}</p>
            <span>Total Deposit</span>
          </div>
          <div className={styles.stat}>
            <p>${withdrawal.toLocaleString("USA")}</p>
            <span>Total Withdrawal</span>
          </div>
          <div className={styles.stat}>
            <p>${total.toLocaleString("USA")}</p>
            <span>Total Transactions</span>
          </div>
          <div className={styles.stat}>
            <p>${totalRef.toLocaleString("USA")}</p>
            <span>Total Referral Bonus</span>
          </div>
        </div>
        <h1>Recent Transactions</h1>
        {transactions.length == 0 ? (
          <div className={styles.transactions}>
            <p>
              You have not made any transactions yet, your future transactions
              will appear here
            </p>
            <Link className="action2" href={"/dashboard/deposit"}>
              Make Deposit
            </Link>
          </div>
        ) : (
          <div className={styles.transactions}>
            {transactions.map((e) => {
              const date = new Date(e.createdAt);
              return (
                <div className={styles.transaction} key={e._id}>
                  <div>
                    <span>Amount</span>
                    <span>{e.amount}</span>
                  </div>
                  <div>
                    <span>Trans. Date</span>
                    <span>{date.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span>Trans. Status</span>
                    {e.status == 0 && (
                      <MdOutlinePending className={styles.icon} />
                    )}
                    {e.status == 1 && (
                      <GoCodescanCheckmark className={styles.icon} />
                    )}
                    {e.status == -1 && <GiCancel className={styles.icon} />}
                  </div>
                  <div>
                    <span>{e.type == 0 ? "Withdrawal" : "Deposit"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.right}>
        <h1>Active Investments</h1>
        {investments.length == 0 ? (
          <div className={styles.investments}>
            <p>
              You have not invested yet, your future investments will appear
              here
            </p>
            <Link className="action2" href={"/dashboard/investments/invest"}>
              Start Investing
            </Link>
          </div>
        ) : (
          <div className={styles.investments}>
            {investments.map((e) => {
              const date = new Date(e.activeDate);
              return (
                <div className={styles.investment} key={e._id}>
                  <p>{e.planName}</p>
                  <div>
                    <span>Amount</span>
                    <span>{e.amount}</span>
                  </div>
                  <div>
                    <span>Investment Date</span>
                    <span>{date.toLocaleDateString()}</span>
                  </div>
                  <Link
                    className="action2"
                    href={`/dashboard/investments/${e._id}`}
                  >
                    Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
