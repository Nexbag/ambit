"use client";
import {
  CryptoOrderBookResponseType,
  WalletTranzResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";

import { useState } from "react";

import Paginate from "@/app/components/js/pager/Paginate";
import { dateValue, sixFrac, twoFrac } from "@/app/components/js/config";
import { RiExchangeFill } from "react-icons/ri";

export default function Body({
  orders,
  history,
}: {
  orders: CryptoOrderBookResponseType[];
  history: WalletTranzResponseType[];
}) {
  const [pageOrders, setPageOrders] = useState<CryptoOrderBookResponseType[]>(
    []
  );
  const [pageTransactions, setPageTransactions] = useState<
    WalletTranzResponseType[]
  >([]);

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <h1>Trading History</h1>
        <div className={styles.column}>
          {pageOrders.map((e) => (
            <div key={e._id} className={styles.order}>
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
          ))}
        </div>
        <Paginate data={orders} setData={setPageOrders} />
      </div>
      <div className={styles.right}>
        <h1>Funding History</h1>
        <div className={styles.column}>
          {pageTransactions.map((e) => {
            return (
              <div key={e._id} className={styles.tran}>
                <div className={styles.details}>
                  <p className={styles.title}>{`${sixFrac(e.qty)} ${
                    e.coin
                  }`}</p>
                  <span className={styles.date}>{dateValue(e.date)}</span>
                </div>
                <div className={styles.amount}>
                  {e.type == 0 ? (
                    <p className={styles.red}>{`-$${twoFrac(e.amount)}`}</p>
                  ) : (
                    <p>{`$${twoFrac(e.amount)}`}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Paginate data={history} setData={setPageTransactions} />
      </div>
    </div>
  );
}
