"use client";
import { useState, useEffect } from "react";
import { Countries } from "../countries";

import styles from "./Transaction.module.scss";
const Transactions: React.FC = () => {
  const [country, setCountry] = useState<string>("");
  const [amount, setAmount] = useState<number>(200);
  const [start, setStart] = useState<boolean>(false);
  useEffect(() => {
    if (start) {
      const time = Math.floor(Math.random() * 28000);
      const paid = Math.round(Math.random() * 24993);
      const text = Countries[Math.floor(Math.random() * Countries.length)];

      const interval = setTimeout(() => {
        setAmount(() => (paid > 200 ? paid : 200));
        setCountry(() => text);
        setStart(() => false);
      }, time);

      return () => {
        clearTimeout(interval);
      };
    } else {
      const interval = setTimeout(() => {
        setAmount(() => 0);
        setCountry(() => "");
        setStart(() => true);
      }, 4500);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [amount, country, start]);
  return (
    <div
      className={
        country.length > 0
          ? `${styles.transactions} ${styles.show}`
          : `${styles.transactions}`
      }
    >
      {amount % 2 == 0 ? (
        <p>
          Someone from <span className="notranslate"> {country}</span>
          {" withdrawed "}
          <span className="notranslate"> ${amount.toLocaleString("USA")}</span>
        </p>
      ) : (
        <p>
          Someone from <span className="notranslate"> {country}</span>
          {" invested "}
          <span className="notranslate"> ${amount.toLocaleString("USA")}</span>
        </p>
      )}
    </div>
  );
};

export default Transactions;
