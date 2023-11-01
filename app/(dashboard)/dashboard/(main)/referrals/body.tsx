"use client";

import {
  ReferralResponseType,
  ReferralTransactionResponseType,
  TransactionResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";
import { useUserContext } from "@/app/components/js/Wrapper";
import { useState } from "react";
import Link from "next/link";
import Paginate from "@/app/components/js/pager/Paginate";

export default function Body({
  referrals,
  transactions,
  total,
}: {
  referrals: ReferralResponseType[];
  transactions: ReferralTransactionResponseType[];
  total: number;
}) {
  const context = useUserContext();
  const user = context?.user;
  const [error, setError] = useState<string>("");

  const [pageReferralTransactions, setPageReferralTransactions] = useState<
    ReferralTransactionResponseType[]
  >([]);

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <h1 className="notranslate">${total.toLocaleString("USA")}</h1>
        <p>Total Earnings</p>
        <p>
          My Link: <br />
          <Link
            href={`${process.env.NEXT_PUBLIC_SERVER_URL}?referralID=${user?.username}`}
            style={{ overflowWrap: "break-word" }}
          >{`${process.env.NEXT_PUBLIC_SERVER_URL}?referralID=${user?.username}`}</Link>
        </p>
      </div>

      <div className={styles.right}>
        {transactions.length == 0 ? (
          <div className={styles.column}>
            <p>You have not referred anyone yet</p>
            <Link
              className="action2"
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}signup?referralID=${user?.username}`}
            >{`${process.env.NEXT_PUBLIC_SERVER_URL}signup?referralID=${user?.username}`}</Link>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.row}>
              <span>Date</span>
              <span>Username</span>
              {user?.admin && <span>Referred By</span>}
              <span>Commission Earned</span>
            </div>
            {pageReferralTransactions.map((ref) => (
              <div className={styles.row} key={ref._id}>
                <span>{ref.createdAt.split("T")[0]}</span>
                <span>{ref.username.toUpperCase()}</span>
                {user?.admin && <span>{ref.rUsername.toUpperCase()}</span>}
                <span>${ref.amount.toLocaleString("USA")}</span>
              </div>
            ))}
          </div>
        )}
        <Paginate data={transactions} setData={setPageReferralTransactions} />
      </div>
    </div>
  );
}
