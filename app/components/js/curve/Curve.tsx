"use client";
import { useState, useEffect } from "react";
import { CryptoResponseType } from "../dataTypes";
import styles from "./Curve.module.scss";
import { TbArrowUpRightCircle, TbArrowDownRightCircle } from "react-icons/tb";
import { getRequest } from "../api_client";
import { cryptoUrl } from "../config";

const months: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CoinPriceTicker: React.FC<{ coinName?: string }> = ({
  coinName = "abt",
}) => {
  const [high, setHigh] = useState<{ date: string; price: number }>();
  const [low, setLow] = useState<{ date: string; price: number }>();

  const [data, setData] = useState<{ date: string; price: number }[]>([]);
  const [crypto, setCrypto] = useState<CryptoResponseType | null>(null);
  const [refetch, setRefetch] = useState<boolean>(true);
  const fetchData = async () => {
    try {
      const { data, success, message } = await getRequest(
        `${cryptoUrl}?coinName=${coinName}`
      );

      if (!success) throw new Error("Failed");
      setCrypto(data.data);
      const values: { date: string; price: number }[] = [];
      data.chart.prices.forEach((price: number[]) => {
        const dateVal = new Date(price[0]);
        const date = `${dateVal
          .getHours()
          .toString()
          .padStart(2, "0")}:${dateVal
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        // const date = `${dateVal.getUTCDate()} ${
        //   months[dateVal.getMonth()]
        // } ${dateVal.getHours()}:${dateVal.getMinutes()}`;
        values.push({ date, price: price[1] });
      });

      setData(() => values);
      const v1 = [...values];
      v1.sort((a, b) => b.price - a.price);

      setHigh(v1[0]);
      setLow(v1[v1.length - 1]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (refetch) {
      fetchData();
      setRefetch(() => false);
    } else {
      setTimeout(() => setRefetch(() => true), 5000 * 60);
    }
  }, [coinName, refetch]);
  useEffect(() => {
    const box = document.querySelector("#box") as HTMLDivElement;
    if (box && data.length > 3) {
      setTimeout(() => {
        const deviceWidth = window.innerWidth;
        const childDiv = box.getElementsByTagName("div")[0];
        const childWidth = childDiv.getBoundingClientRect().width;
        const width = (childWidth * data.length) / deviceWidth;
        const time = Math.round(width / 3);
        const body = document.querySelector("body");
        body?.style.setProperty("--length", `-${width + deviceWidth}px`);
        body?.style.setProperty("--time", `${time}s`);
      }, 1500);
    }
  }, [data]);
  return (
    <div className={styles.curve}>
      <div className={styles.left}>
        <div>
          <span>{crypto?.name} PRICE FOR THE LAST 24 hours</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.notices}>
          <div className={styles.notice}>
            <span>
              $
              {low?.price.toLocaleString("en-US", {
                maximumFractionDigits: 6,
                minimumFractionDigits: 2,
              })}
            </span>
            <span>{low?.date}</span>
            <span>24h Low</span>
          </div>
          <div className={styles.notice}>
            <span>
              $
              {high?.price.toLocaleString("en-US", {
                maximumFractionDigits: 6,
                minimumFractionDigits: 2,
              })}
            </span>
            <span>{high?.date}</span>
            <span>24h High</span>
          </div>
        </div>
        <div className={styles.box} id="box">
          {data.map((day, i) => (
            <div key={i} className={styles.child}>
              <span
                className={
                  data[i].price > (data[i - 1]?.price || data[i].price)
                    ? styles.up
                    : styles.down
                }
              >
                $
                {day.price.toLocaleString("en-US", {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 2,
                })}{" "}
                {data[i].price > (data[i - 1]?.price || data[i].price) ? (
                  <TbArrowUpRightCircle />
                ) : (
                  <TbArrowDownRightCircle />
                )}
              </span>
              <span>{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DarkCoinTicker = () => {
  return (
    <div className={styles.dark}>
      <CoinPriceTicker />
    </div>
  );
};

export default CoinPriceTicker;
