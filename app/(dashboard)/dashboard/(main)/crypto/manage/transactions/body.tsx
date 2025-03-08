"use client";
import {
  CryptoOrderBookResponseType,
  WalletTranzResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";

import { useState } from "react";

import Paginate from "@/app/components/js/pager/Paginate";
import {
  cryptoOrderBookUrl,
  dateValue,
  sixFrac,
  twoFrac,
} from "@/app/components/js/config";
import { RiExchangeFill } from "react-icons/ri";
import { putRequest } from "@/app/components/js/api_client";
import { useUserContext } from "@/app/components/js/Wrapper";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export default function Body({
  orders,
}: {
  orders: CryptoOrderBookResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;
  const [pageOrders, setPageOrders] = useState<CryptoOrderBookResponseType[]>(
    []
  );
  const [allOrders, setAllOrders] =
    useState<CryptoOrderBookResponseType[]>(orders);

  const [message, setMessage] = useState<string>("");

  async function filterOrders(username: string) {
    setAllOrders(() => orders.filter((e) => e.username.includes(username)));
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
  async function handleOrder(id: string) {
    setMessage("Please wait...");

    const basePrice = document.getElementById(
      `${id}baseprice`
    ) as HTMLInputElement;
    const newPrice = document.getElementById(
      `${id}newprice`
    ) as HTMLInputElement;
    const baseQty = document.getElementById(`${id}baseqty`) as HTMLInputElement;
    const date = document.getElementById(`${id}date`) as HTMLInputElement;

    function makeFloat(container: HTMLInputElement) {
      const value = parseFloat(container.value);
      return value;
    }
    const dateVal = new Date(date.value).getTime();

    const { data, message } = await putRequest(
      `${cryptoOrderBookUrl}${id}`,
      {
        basePrice: makeFloat(basePrice),
        newPrice: makeFloat(newPrice),
        baseQty: makeFloat(baseQty),
        date: dateVal,
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
        <h1>Trading History</h1>
        <div className={styles.column}>
          {pageOrders.map((e) => (
            <div key={e._id} className={styles.orderBox}>
              <div className={styles.order}>
                <div className={styles.details}>
                  <div className={styles.title}>
                    <span>{`${sixFrac(e.baseQty)} ${e.baseCoin} @ ${sixFrac(
                      e.basePrice
                    )}`}</span>
                    <RiExchangeFill />
                    <span>{`${sixFrac(e.newQty)} ${e.newCoin} @ ${sixFrac(
                      e.newPrice
                    )}`}</span>
                  </div>
                  <p className={styles.date}>{dateValue(e.date)}</p>
                </div>
              </div>
              <div className={styles.mod}>
                <div>
                  <label>{`${e.baseCoin} New Price`}</label>
                  <input
                    type="number"
                    id={`${e._id}baseprice`}
                    defaultValue={e.basePrice}
                  />
                </div>
                <div>
                  <label>{`${e.baseCoin} Qty`}</label>
                  <input
                    type="number"
                    id={`${e._id}baseqty`}
                    defaultValue={e.baseQty}
                  />
                </div>
                <div>
                  <label>{`${e.newCoin} New Price`}</label>
                  <input
                    type="number"
                    id={`${e._id}newprice`}
                    defaultValue={e.newPrice}
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
                  onClick={() => handleOrder(e._id)}
                >
                  Modify
                </span>
              </div>
            </div>
          ))}
        </div>
        <Paginate data={allOrders} setData={setPageOrders} />
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
