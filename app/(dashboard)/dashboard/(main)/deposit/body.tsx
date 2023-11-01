"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./styles.module.scss";
import { WalletResponseType } from "@/app/components/js/dataTypes";
import { useUserContext } from "@/app/components/js/Wrapper";
import { postRequest } from "@/app/components/js/api_client";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import { transactionUrl } from "@/app/components/js/config";
import { uploadFile } from "@/app/components/js/firebaseconfig";

export const Body: React.FC<{ adminWallets: WalletResponseType[] }> = ({
  adminWallets,
}) => {
  const context = useUserContext();
  const user = context?.user;

  const [amount, setAmount] = useState<number>(300);
  const [error, setError] = useState<string>("");
  const [selWallet, setSelWallet] = useState<WalletResponseType>();
  const [senderWalletAddress, setSenderWalletAddress] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async () => {
    setError("Please wait...");
    const date = new Date();
    const images = await uploadFile(`Deposit ${date.getTime()}`, "form");
    const { data, success, message } = await postRequest(
      transactionUrl,
      {
        amount,
        wallet: senderWalletAddress,
        image: images[0],
        type: 1,
        network: selWallet?.coin,
      },
      user?.token
    );
    if (!success) {
      showError(setError, message);
      return;
    }

    router.replace("/dashboard/transactions?type=1");
    showError(setError, "Success...");
  };

  return (
    <div className={styles.main}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        id="form"
      >
        <h1>Fund Your Account</h1>
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(() => parseFloat(e.target.value))}
        />

        <label htmlFor="SelCoin">Payment channel</label>
        <select
          id="SelCoin"
          value={selWallet?.coin || ""}
          onChange={(e) =>
            setSelWallet(
              () => adminWallets.find((coin) => coin.coin == e.target.value)!
            )
          }
        >
          <option value="">Choose coin</option>
          {adminWallets.map((coin) => (
            <option value={coin.coin} key={coin._id}>
              {coin.coin.toUpperCase()}
            </option>
          ))}
        </select>
        {selWallet && (
          <div className={styles.col}>
            <span>Pay To:</span>
            <h2
              onClick={(e) => {
                const target = e.target as HTMLHeadingElement;
                target.textContent = "Copied";
                navigator.clipboard.writeText(selWallet?.address);
                setTimeout(() => {
                  target.textContent = selWallet?.address;
                }, 1200);
              }}
            >
              {selWallet?.address}
            </h2>
          </div>
        )}
        <label htmlFor="senderWalletAddress">Sender Wallet Address</label>
        <input
          type="text"
          value={senderWalletAddress}
          onChange={(e) => setSenderWalletAddress(() => e.target.value)}
        />
        <label>Upload payment screenshot</label>
        <input type="file" accept="image/*" />

        <button disabled={senderWalletAddress.length < 15 || amount < 0}>
          Deposit
        </button>
      </form>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Body;
