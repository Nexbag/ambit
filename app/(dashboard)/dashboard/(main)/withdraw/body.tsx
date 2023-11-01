"use client";
import { FormEvent, useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { useUserContext } from "@/app/components/js/Wrapper";
import { Networks, WalletResponseType } from "@/app/components/js/dataTypes";
import { useRouter } from "next/navigation";
import { postRequest } from "@/app/components/js/api_client";
import { transactionUrl } from "@/app/components/js/config";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export default function Body({ wallets }: { wallets: WalletResponseType[] }) {
  const context = useUserContext();
  const user = context?.user;
  const [wallet, setWallet] = useState<string>(wallets[0]?.address || "");
  const [network, setNetwork] = useState<string>(
    wallets[0]?.coin || Networks[0].value
  );
  const [image, setImage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [typeIt, setTypeIt] = useState<boolean>(wallets.length == 0);
  const [amount, setAmount] = useState<number>(300);

  const router = useRouter();

  useEffect(() => {
    setWallet((e) =>
      typeIt ? "" : wallets.find((wal) => wal.coin == network)?.address || ""
    );
    setNetwork((e) => (typeIt ? Networks[0].value : e));
  }, [typeIt]);
  useEffect(() => {
    setImage(() => Networks.find((net) => net.value == network)?.img || "");
  }, [network]);
  const handleWithdraw = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("please wait...");

    const { success, message } = await postRequest(
      transactionUrl,
      {
        amount,
        type: 0,
        wallet,
        network,
      },
      `${user?.token}`
    );

    success ? setMessage(message) : showMessage(setMessage, message);
    success && router.replace(`/dashboard/transactions`);
  };

  return (
    <div className={styles.main}>
      <form onSubmit={handleWithdraw}>
        <h1>Withdrawal</h1>
        <label htmlFor="wallets">Choose wallet</label>
        {wallets.length > 0 && (
          <span
            className={styles.action}
            onClick={() => {
              if (typeIt && wallets.length < 2) return;

              setTypeIt((e) => !e);
            }}
          >
            {typeIt ? "Choose existing wallet" : "Enter new wallet"}
          </span>
        )}
        {wallets.length > 0 && !typeIt ? (
          <select
            id="wallets"
            onChange={(e) => {
              const sel = wallets.filter(
                (wallet) => wallet.coin === e.target.value
              );
              setWallet(sel[0].address);
              setNetwork(sel[0].coin);
            }}
            value={network}
          >
            {wallets.map((wallet) => (
              <option key={wallet._id} value={wallet.coin}>
                {wallet.coin.toUpperCase()}
              </option>
            ))}
          </select>
        ) : (
          <div className={styles.col}>
            <label>Network</label>
            <select
              onChange={(e) => setNetwork(e.target.value)}
              value={network}
            >
              {Networks.map((network, i) => (
                <option value={network.value} key={i}>
                  {network.network.toUpperCase()}
                </option>
              ))}
            </select>
            <label>Address</label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />
          </div>
        )}

        <h3 style={{ overflowWrap: "break-word" }}>{wallet}</h3>
        <img
          src={image}
          alt=""
          style={{
            height: "60px",
            backgroundColor: "var(--white)",
            borderRadius: "12px",
          }}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />

        {amount > (user?.balance || 0) && (
          <h2
            style={{
              overflowWrap: "break-word",
              color: "var(--s)",

              textAlign: "center",
            }}
          >
            Insufficient funds
          </h2>
        )}
        <button
          disabled={
            wallet.length < 10 || !network || amount > (user?.balance || 0)
          }
        >
          Withdraw
        </button>
      </form>
      {message && <Spinner error={message} />}
    </div>
  );
}
