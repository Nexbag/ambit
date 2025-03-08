"use client";
import { createChart, AreaSeries, ColorType } from "lightweight-charts";
import {
  CryptoResponseType,
  CryptoWalletResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

import { useUserContext } from "@/app/components/js/Wrapper";
import { cryptoWalletUrl } from "@/app/components/js/config";
import { putRequest } from "@/app/components/js/api_client";
import Image from "next/image";
import Spinner from "@/app/components/js/spinner/Spinner";
import CoinPriceTicker from "@/app/components/js/curve/Curve";
import showError from "@/app/components/js/showError";

export default function Body({
  wallet,

  prices,
}: {
  wallet: CryptoWalletResponseType;
  crypto: CryptoResponseType;
  prices: number[][];
}) {
  const context = useUserContext();
  const user = context?.user;

  const [qty, setQty] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  let make = true;
  useEffect(() => {
    if (!make) return;
    function formatDate(timestamp: number) {
      const date = new Date(timestamp);
      const year = date.getFullYear();

      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    const chartOptions = {
      layout: {
        textColor: "white",
        background: { type: ColorType.VerticalGradient, color: "black" },
      },
    };
    const chart = createChart(document.getElementById("chart")!, chartOptions);
    chart.applyOptions({
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    });
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#87ffa1",
      topColor: "rgba(0, 0, 0, 0.182)",
      lineWidth: 2,
      bottomColor: "rgba(0, 0, 0, 0.282)",
    });
    areaSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.3, // leave some space for the legend
        bottom: 0.25,
      },
    });

    const values = prices.map((e) => {
      const time = formatDate(e[0]);

      return { time, value: e[1] };
    });
    values.splice(values.length - 2, 1);
    areaSeries.setData(values);

    chart.timeScale().fitContent();
    make = false;
  }, []);
  async function handleExchange(type: number) {
    setMessage("Please wait");
    const { data, message } = await putRequest(
      `${cryptoWalletUrl}${wallet._id}`,
      {
        qty: parseFloat(qty),
        type,
      },
      user?.token
    );
    if (data) {
      setMessage(message);
      location.reload();
    } else showError(setMessage, message);
  }

  return (
    <div className={styles.main}>
      <CoinPriceTicker coinName={wallet.coin} />
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.wallet} key={wallet._id}>
            <div className={styles.address}>
              <p>{wallet.address}</p>
              <span>Amber Address</span>
            </div>
            <div className={styles.row}>
              <div className={styles.img}>
                <Image
                  src={wallet.image}
                  height={80}
                  width={80}
                  alt={wallet.symbol}
                />
              </div>
              <div className={styles.details}>
                <p>{wallet.name}</p>
                <div>
                  <p>
                    $
                    {wallet.currentPrice.toLocaleString("en-US", {
                      maximumFractionDigits: 6,
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className={styles.value}>
                <h2>
                  $
                  {(wallet.balance * wallet.currentPrice).toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 2, minimumFractionDigits: 2 }
                  )}
                </h2>
                <div>
                  <p>{`${wallet.symbol.toUpperCase()} ${wallet.balance.toLocaleString(
                    "USA"
                  )}`}</p>
                </div>
                <p className={styles.info}>Wallet balance</p>
              </div>
            </div>
          </div>
          <div className={styles.searchBar}>
            <span
              className={styles.ex}
            >{`${wallet.symbol.toUpperCase()}/USDT Exchange`}</span>

            <input
              type="number"
              step="any"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <div className={styles.prices}>
              <span>{`Equivalent to $${(
                wallet.currentPrice * parseFloat(qty)
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}`}</span>
            </div>
            <div className={styles.actions}>
              <span className="action" onClick={() => handleExchange(1)}>
                Buy
              </span>
              <span className="action" onClick={() => handleExchange(0)}>
                Sell
              </span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          {/* <div id="bars"></div> */}
          <div id="chart"></div>
        </div>
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
