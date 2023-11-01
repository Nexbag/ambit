"use client";

import { MdOutlinePending } from "react-icons/md";
import { FcApproval, FcCancel } from "react-icons/fc";
import { TransactionResponseType } from "@/app/components/js/dataTypes";
import { getRequest, putRequest } from "@/app/components/js/api_client";
import { useUserContext } from "@/app/components/js/Wrapper";
import { transactionUrl } from "@/app/components/js/config";
import { useState } from "react";
import styles from "./styles.module.scss";
import Spinner from "@/app/components/js/spinner/Spinner";
import showError from "@/app/components/js/showError";
import Paginate from "@/app/components/js/pager/Paginate";
import Link from "next/link";
export const Body: React.FC<{
  transactionz: TransactionResponseType[];
}> = ({ transactionz }) => {
  const context = useUserContext();
  const user = context?.user;
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [transactions, setTransactions] =
    useState<TransactionResponseType[]>(transactionz);
  const [pageTransactions, setPageTransactions] = useState<
    TransactionResponseType[]
  >([]);

  const fetchData = async (username: string, status: string, type: string) => {
    const { data, success, message } = await getRequest(
      `${transactionUrl}?username=${username || ""}&status=${
        status || ""
      }&type=${type || ""}`,
      user?.token
    );
    {
      !success && showError(setError, message);
    }
    if (success) setTransactions(data);
  };
  const handleStatus = async (id: string, status: number) => {
    if (!user?.admin) return;
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${transactionUrl}${id}`,
      { status },
      `${user?.token}`
    );
    showError(setError, message);
    if (success) {
      setTransactions((e) =>
        e.map((c) => {
          c.status = c._id == id ? status : c.status;
          return c;
        })
      );
    }
  };

  return (
    <div className={styles.transactions}>
      <h1>Transactions</h1>
      <div className={styles.table}>
        <div className={styles.controllers}>
          {user?.admin && (
            <div className={styles.username}>
              <input
                type="text"
                value={username}
                placeholder="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <span
                className="action2"
                onClick={() => {
                  fetchData(username, status, type);
                }}
              >
                Search
              </span>
            </div>
          )}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              fetchData(username, e.target.value, type);
            }}
          >
            <option value="">Status</option>
            <option value="0">Pending</option>
            <option value="1">Successful</option>
            <option value="-1">Cancelled</option>
          </select>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              fetchData(username, status, e.target.value);
            }}
          >
            <option value="">Type</option>
            <option value="0">Withdrawal</option>
            <option value="1">Deposit</option>
          </select>
        </div>
        {pageTransactions.map((tran) => (
          <div key={tran._id} className={styles.transaction}>
            <div className={styles.icon}>
              {tran.status == 1 && (
                <span style={{ color: "green" }}>
                  <FcApproval />
                </span>
              )}
              {tran.status == 0 && (
                <span style={{ color: "var(--pl)" }}>
                  <MdOutlinePending />
                </span>
              )}
              {tran.status == -1 && (
                <span style={{ color: "var(--s)" }}>
                  <FcCancel />
                </span>
              )}
            </div>
            <div className={styles.desc}>
              <p>
                {tran.network.toUpperCase()}{" "}
                {tran.type == 1 ? "Deposit" : "Withdrawal"} to {tran.wallet} via{" "}
                {tran._id} on {tran.network.toUpperCase()} network.
              </p>
              <p>
                {user?.admin && (
                  <span>{tran.username.toUpperCase()} &nbsp;</span>
                )}

                <span>{tran.createdAt.split("T")[0]}</span>
              </p>
            </div>
            <div className={styles.info}>
              <p className={styles.amount}>
                {tran.type == 0 && tran.status == 1 && "-"}$
                {tran.amount.toLocaleString("USA")}
              </p>
            </div>

            {user?.admin && (
              <div className={styles.actions}>
                <a
                  href={tran.image}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="action2"
                >
                  Image
                </a>
                <button
                  onClick={() => handleStatus(tran._id, 1)}
                  className={styles.action}
                  disabled={tran.status == 1}
                >
                  Approve
                </button>
                <button
                  className={styles.action}
                  disabled={tran.status == -1}
                  onClick={() => handleStatus(tran._id, -1)}
                >
                  Disapprove
                </button>
              </div>
            )}
          </div>
        ))}
        {transactions.length == 0 && <h1>No Transaction at the moment.</h1>}
        {transactions.length == 0 && (
          <Link href={"/dashboard/deposit"} className="action2">
            Deposit
          </Link>
        )}
      </div>

      <Paginate data={transactions} setData={setPageTransactions} />
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Body;
