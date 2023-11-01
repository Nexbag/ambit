"use client";
import {
  CryptoResponseType,
  CryptoWalletResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";
import { useUserContext } from "@/app/components/js/Wrapper";
import { useState } from "react";
import { putRequest } from "@/app/components/js/api_client";
import showMessage from "@/app/components/js/showError";
import { cryptoUrl, cryptoWalletUrl } from "@/app/components/js/config";
import Spinner from "@/app/components/js/spinner/Spinner";
import Image from "next/image";

export default function Body({
  wallets,
  cryptos,
}: {
  wallets: CryptoWalletResponseType[];
  cryptos: CryptoResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;
  const [message, setMessage] = useState<string>("");
  const [receiverWalletAddress, setReceiverWalletAddress] =
    useState<string>("");
  const [coinId, setCoinId] = useState<string>("");
  const [senderWalletAddress, setSenderWalletAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [qty, setQty] = useState<string>("");

  const handleExchange = async (type: number) => {
    setMessage("Please wait...");
    const { success, message } = await putRequest(
      cryptoUrl + coinId,
      {
        qty: parseFloat(qty),
        type,
      },
      `${user?.token}`
    );
    showMessage(setMessage, message);
    success && location.reload();
  };
  const handleTransfer = async () => {
    setMessage("Please wait...");
    const { success, message } = await putRequest(
      cryptoWalletUrl,
      {
        receiverWalletAddress,
        senderWalletAddress,
        amount: parseFloat(amount),
      },
      `${user?.token}`
    );
    showMessage(setMessage, message);
    success && location.reload();
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
        <div className={styles.wallets}>
          <h1>Wallets</h1>
          {wallets.map((wallet) => (
            <div className={styles.wallet} key={wallet._id}>
              <div className={styles.img}>
                <Image
                  src={wallet.image}
                  height={80}
                  width={80}
                  alt={wallet.symbol}
                />
              </div>
              <div className={styles.details}>
                <h3>{wallet.address}</h3>
                <p>{wallet.name}</p>
                <div>
                  <p>{wallet.symbol.toUpperCase()}</p>
                  <p>{wallet.currentPrice.toLocaleString("USA")}</p>
                </div>
              </div>
              <div className={styles.value}>
                <h2>
                  $
                  {(wallet.balance * wallet.currentPrice).toLocaleString("USA")}
                </h2>
                <div>
                  <p>{wallet.symbol.toUpperCase()}</p>
                  <p>{wallet.balance.toLocaleString("USA")}</p>
                </div>
                <p className={styles.info}>Wallet balance</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.exchange}>
          <h2>Swap Token</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label>Token Name</label>
            <select value={coinId} onChange={(e) => setCoinId(e.target.value)}>
              <option value="">Choose</option>
              {cryptos.map((e) => (
                <option value={e._id} key={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
            <label>Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
            <div className={styles.actions}>
              <button onClick={() => handleExchange(1)}>Buy</button>
              <button onClick={() => handleExchange(0)}>Sell</button>
            </div>
          </form>
        </div>
        <div className={styles.exchange}>
          <h2>Send Token</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label>Choose Token</label>
            <select
              value={senderWalletAddress}
              onChange={(e) => {
                setSenderWalletAddress(e.target.value);
              }}
            >
              <option value="">Choose</option>
              {wallets.map((e) => (
                <option value={e.address} key={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label>Receiver Wallet Address</label>
            <input
              type="text"
              value={receiverWalletAddress}
              onChange={(e) => setReceiverWalletAddress(e.target.value)}
            />
            <button onClick={() => handleTransfer()}>Send</button>
          </form>
        </div>
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
