"use client";
import { FormEvent, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  NetworkType,
  Networks,
  WalletResponseType,
} from "@/app/components/js/dataTypes";
import {
  deleteRequest,
  postRequest,
  putRequest,
} from "@/app/components/js/api_client";
import { usersUrl, walletUrl } from "@/app/components/js/config";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Link from "next/link";

export default function Body({
  wallets: walz,
}: {
  wallets: WalletResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;
  const [message, setMessage] = useState<string>("");

  const [coin, setCoin] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [wallets, setWallets] = useState<WalletResponseType[]>(walz);
  const [networks, setNetworks] = useState<NetworkType[]>([]);
  useEffect(() => {
    setNetworks(() =>
      Networks.filter((net) => {
        const found = wallets.find((coin) => coin.coin == net.value);
        if (!found) return net;
      })
    );
  }, [wallets]);

  const handleUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 5) return;
    setMessage("please wait...");

    const { message } = await putRequest(
      `${usersUrl}${user?._id}`,
      { password },
      user?.token
    );
    showMessage(setMessage, message);
  };

  const handleWallet = async (
    type: number,
    wallet?: WalletResponseType,
    newAddress?: string
  ) => {
    setMessage("Please wait");

    if (type == 1) {
      const { success, message } = await putRequest(
        walletUrl + wallet?._id,
        {
          address: newAddress!.trim(),
        },
        `${user?.token}`
      );

      showMessage(setMessage, message);
      const mod = wallets.map((e) => {
        e.address = e._id == wallet?._id ? newAddress!.trim() : e.address;
        return e;
      });
      setWallets((e) => (success ? mod : e));
      return;
    }
    if (type == 0) {
      const { message, success, data } = await postRequest(
        walletUrl,
        {
          coin: coin.trim(),
          address: address.trim(),
        },
        `${user?.token}`
      );

      setCoin("");
      setAddress("");
      showMessage(setMessage, message);
      setWallets((e) => (success ? [...e, data] : e));
      return;
    }
    if (type == -1) {
      const { success, message } = await deleteRequest(
        `${walletUrl}${wallet!._id}`,

        `${user?.token}`
      );
      success &&
        setWallets((walletsData) => {
          const newWallets = walletsData.filter(
            (wallez) => wallez.coin != wallet?.coin
          );

          return newWallets;
        });
      showMessage(setMessage, message);
      return;
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.column}>
        <div className={styles.planAccount}>
          <div className={styles.upper}>
            <h3>{user?.name ? user.name + " " + user.oNames : ""}</h3>
            <p className={styles.interest}>
              {user?.username && user.username.toUpperCase()}
            </p>
            <p>{user?.email && user.email}</p>
          </div>
          <div className={styles.lower}>
            <p>
              <span>Country:</span>
              <span>{user?.country && user.country}</span>
            </p>
            {user?.referredBy && (
              <p>
                <span>Referred By:</span>
                <span>{user?.referredBy && user.referredBy.toUpperCase()}</span>
              </p>
            )}
            <p>
              <span>KYC status:</span>
              <span>{user?.kyc ? "Approved" : "Pending"}</span>
            </p>
            <p>
              <span>
                {!user?.verified && "Your email has not been verified"}
              </span>
            </p>
            <p>
              <span>Referral Link:</span>
              <span>
                {`${process.env.NEXT_PUBLIC_SERVER_URL}signup?referralID=${user?.username}`}
              </span>
            </p>
          </div>
        </div>
        <form onSubmit={(e) => handleUser(e)}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button disabled={password.length < 5}>Change Password</button>
        </form>
      </div>

      <div className={styles.column}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleWallet(0);
          }}
        >
          <p>Add Wallet Address</p>
          <label htmlFor="coinName">Network</label>
          <select
            id="coinName"
            onChange={(e) => setCoin(e.target.value)}
            value={coin}
          >
            <option value={""}>Choose</option>
            {networks.map((network, i) => (
              <option value={network.value} key={i}>
                {network.network.toUpperCase()}
              </option>
            ))}
          </select>
          <label htmlFor="walletAddress">Wallet Address</label>
          <input
            type="text"
            name="wallet address"
            placeholder="wallet address"
            value={address}
            id="walletAddress"
            onChange={(e) => setAddress(e.target.value)}
          />

          <button disabled={coin.length < 2 || address.length < 10}>
            Add Wallet
          </button>
        </form>
        <Link href={"/dashboard/wallet_connect"} className="action2">
          Link Wallet
        </Link>
        {wallets.map((wallet) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            key={wallet._id}
          >
            <input value={wallet.coin.toUpperCase()} disabled={true} />
            <label>Wallet Address</label>
            <input
              type="text"
              name="wallet address"
              placeholder={wallet.address}
              defaultValue={wallet.address}
              id={wallet._id}
            />
            <button
              onClick={() => handleWallet(-1, wallet)}
              style={{ backgroundColor: "red" }}
            >
              Delete Wallet
            </button>
            <button
              onClick={() => {
                const address = document.getElementById(
                  wallet._id
                ) as HTMLInputElement;
                handleWallet(1, wallet, address.value);
              }}
            >
              Update Wallet
            </button>
          </form>
        ))}
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
