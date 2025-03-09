"use client";

import {
  CryptoResponseType,
  CryptoWalletResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";

import { useUserContext } from "@/app/components/js/Wrapper";
import { cryptoWalletUrl, sixFrac, twoFrac } from "@/app/components/js/config";
import { putRequest } from "@/app/components/js/api_client";
import Image from "next/image";
import Spinner from "@/app/components/js/spinner/Spinner";

import showError from "@/app/components/js/showError";
import CandleChart from "./candle";

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

  const [qty, setQty] = useState<string>("1");
  const [amount, setAmount] = useState<string>(wallet.currentPrice.toString());
  const [message, setMessage] = useState<string>("");
  const [buy, setBuy] = useState<boolean>(true);

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
      location.replace("/dashboard/crypto/transactions");
    } else showError(setMessage, message);
  }
  useEffect(() => {
    setQty((parseFloat(amount || "0") / wallet.currentPrice).toString());
  }, [amount, wallet]);
  useEffect(() => {
    setAmount((parseFloat(qty || "0") * wallet.currentPrice).toString());
  }, [qty, wallet]);
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {wallet.coin != "usdt" && (
          <div className={styles.left}>
            <div className={styles.searchBar}>
              <div className={styles.myActions}>
                <span
                  onClick={() => setBuy(true)}
                  className={buy ? styles.active : ""}
                >
                  Buy
                </span>
                <span
                  onClick={() => setBuy(false)}
                  className={!buy ? styles.active : ""}
                >
                  Sell
                </span>
              </div>
              <input
                type="number"
                placeholder={wallet.symbol.toUpperCase()}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <input
                type="number"
                placeholder={"USDT"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className={styles.ex}>
                <p>{`Wallet Balance`}</p>
                <div>
                  <p>{`${sixFrac(wallet.balance)} ${wallet.symbol}`}</p>
                  <p>{`$${twoFrac(wallet.balance * wallet.currentPrice)}`}</p>
                </div>
              </div>
              <div className={styles.actions}>
                {buy ? (
                  <span className="action" onClick={() => handleExchange(1)}>
                    Buy
                  </span>
                ) : (
                  <span
                    style={{ color: "white", background: "red" }}
                    className="action"
                    onClick={() => handleExchange(0)}
                  >
                    Sell
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={styles.right}>
          <div className={styles.coin}>
            <div className={styles.details}>
              <p>{`${wallet.symbol.toUpperCase()}${
                wallet.coin == "usdt" ? "" : "/USDT"
              }`}</p>
              <p>{`$${
                wallet.currentPrice >= 0.9
                  ? twoFrac(wallet.currentPrice)
                  : sixFrac(wallet.currentPrice)
              }`}</p>
            </div>
            <div className={styles.img}>
              <Image
                src={wallet.image}
                height={80}
                width={80}
                alt={wallet.symbol}
              />
            </div>
          </div>
          <CandleChart
            cryptoWalletUrl={cryptoWalletUrl}
            user={user!}
            wallet={wallet}
            prices={prices}
          />
        </div>
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
