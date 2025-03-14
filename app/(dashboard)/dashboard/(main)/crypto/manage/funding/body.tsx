"use client";
import { WalletTranzResponseType } from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";

import { useState } from "react";

import Paginate from "@/app/components/js/pager/Paginate";
import {
  cryptoTransactionUrl,
  dateValue,
  sixFrac,
  twoFrac,
} from "@/app/components/js/config";

import { putRequest } from "@/app/components/js/api_client";
import { useUserContext } from "@/app/components/js/Wrapper";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export default function Body({
  transactions,
}: {
  transactions: WalletTranzResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;
  const [pageTrans, setPageTrans] = useState<WalletTranzResponseType[]>([]);
  const [allTrans, setAllTrans] =
    useState<WalletTranzResponseType[]>(transactions);

  const [message, setMessage] = useState<string>("");

  async function filterOrders(username: string) {
    setAllTrans(() =>
      transactions.filter((e) => e.username.includes(username))
    );
  }
  function formatDateTimeLocal(dateVal: number) {
    const date = new Date(dateVal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  async function handleTran(id: string) {
    setMessage("Please wait...");

    const qtyCont = document.getElementById(`${id}qty`) as HTMLInputElement;
    const date = document.getElementById(`${id}date`) as HTMLInputElement;

    function makeFloat(container: HTMLInputElement) {
      const value = parseFloat(container.value);
      return value;
    }
    const dateVal = new Date(date.value).getTime();
    const newQty = makeFloat(qtyCont);
    const found = transactions.find((e) => e._id == id)!;
    const diff = newQty - found.qty;
    const { data, message } = await putRequest(
      `${cryptoTransactionUrl}${id}`,
      {
        date: dateVal,
        qty: diff,
      },
      user?.token
    );
    if (data) {
      setMessage(message);
      location.reload();
    } else {
      showMessage(setMessage, message);
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => filterOrders(e.target.value)}
          />
        </div>
        <h1>Wallet History</h1>
        <div className={styles.column}>
          {pageTrans.map((e) => (
            <div key={e._id} className={styles.orderBox}>
              <div className={styles.order}>
                <div className={styles.details}>
                  <div className={styles.title}>
                    <span>{`${e.username}: ${
                      e.type == 1 ? "Funding " : "Withdrawal "
                    } ${sixFrac(e.qty)} ${e.coin} @ ${twoFrac(
                      e.amount
                    )}`}</span>
                  </div>
                  <p className={styles.date}>{dateValue(e.date)}</p>
                </div>
              </div>
              <div className={styles.mod}>
                <div>
                  <label>{`${e.coin} Qty`}</label>
                  <input
                    type="number"
                    id={`${e._id}qty`}
                    defaultValue={e.qty}
                  />
                </div>
                <div>
                  <label>New Date</label>
                  <input
                    type="datetime-local"
                    id={`${e._id}date`}
                    defaultValue={formatDateTimeLocal(e.date)}
                  />
                </div>
                <span
                  className={`action ${styles.action}`}
                  onClick={() => handleTran(e._id)}
                >
                  Modify
                </span>
              </div>
            </div>
          ))}
        </div>
        <Paginate data={allTrans} setData={setPageTrans} />
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
