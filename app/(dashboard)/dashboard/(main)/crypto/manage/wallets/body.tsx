"use client";
import {
  CryptoResponseType,
  CryptoWalletResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";
import { useState } from "react";
import Paginate from "@/app/components/js/pager/Paginate";
import { useUserContext } from "@/app/components/js/Wrapper";
import { cryptoWalletUrl, sixFrac, twoFrac } from "@/app/components/js/config";
import { putRequest } from "@/app/components/js/api_client";
import Image from "next/image";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export default function Body({
  wallets,
  cryptos,
}: {
  wallets: CryptoWalletResponseType[];
  cryptos: CryptoResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;
  const [allWallets, setAllWallets] =
    useState<CryptoWalletResponseType[]>(wallets);
  const [pageWallets, setPageWallets] =
    useState<CryptoWalletResponseType[]>(wallets);
  const [selWallet, setSelWallet] = useState<CryptoWalletResponseType | null>(
    null
  );
  const [qty, setQty] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [newCoin, setNewCoin] = useState<string>("usdt");

  async function filterWallets(username: string) {
    setAllWallets((e) => wallets.filter((e) => e.username.includes(username)));
  }
  async function handleTop({
    qty,
    move = false,
    newCoin,
  }: {
    qty: number;
    move?: boolean;
    newCoin?: string;
  }) {
    setMessage("Please wait...");
    const { data, message } = await putRequest(
      `${cryptoWalletUrl}${selWallet?._id}`,
      {
        move,
        qty,
        newCoin,
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
            onChange={(e) => filterWallets(e.target.value)}
          />
        </div>
        <div className={styles.wallets}>
          {pageWallets.map((wallet) => (
            <div
              className={styles.wallet}
              key={wallet._id}
              onClick={() => setSelWallet(wallet)}
            >
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
                <p>{`$${sixFrac(wallet.currentPrice)}`}</p>
                <p>{`Username ${wallet.username}`}</p>
              </div>
              <div className={styles.value}>
                <h2>{`$${twoFrac(wallet.balance * wallet.currentPrice)}`}</h2>

                <p>{`${sixFrac(
                  wallet.balance
                )} ${wallet.symbol.toUpperCase()}`}</p>

                <p className={styles.info}>Wallet balance</p>
              </div>
            </div>
          ))}
        </div>
        <Paginate data={allWallets} setData={setPageWallets} />
      </div>
      <div className={styles.right}>
        {selWallet ? (
          <div className={styles.selWallet}>
            <div className={styles.top}>
              <div className={styles.wallet}>
                <div className={styles.img}>
                  <Image
                    src={selWallet.image}
                    height={80}
                    width={80}
                    alt={selWallet.symbol}
                  />
                </div>
                <div className={styles.details}>
                  <h3>{selWallet.address}</h3>
                  <p>{selWallet.name}</p>
                  <p>{`$${sixFrac(selWallet.currentPrice)}`}</p>
                  <p>{`Username: ${selWallet.username}`}</p>
                </div>
                <div className={styles.value}>
                  <h2>{`$${twoFrac(
                    selWallet.balance * selWallet.currentPrice
                  )}`}</h2>

                  <p>{`${sixFrac(
                    selWallet.balance
                  )} ${selWallet.symbol.toUpperCase()}`}</p>

                  <p className={styles.info}>Wallet balance</p>
                </div>
              </div>
              <span className="action" onClick={() => setSelWallet(null)}>
                X
              </span>
            </div>
            <div className={styles.exchange}>
              <input
                type="number"
                placeholder="Enter Quantity"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <div className={styles.actions}>
                <span
                  className="action"
                  onClick={() => {
                    handleTop({ qty: parseFloat(qty) });
                  }}
                >
                  Top up
                </span>
                <span
                  className="action"
                  onClick={() => {
                    handleTop({ qty: parseFloat(qty) * -1 });
                  }}
                >
                  Deduct
                </span>
                <span
                  className="action"
                  onClick={() => {
                    handleTop({ qty: parseFloat(qty), move: true });
                  }}
                >
                  {"Transfer to available balance"}
                </span>
              </div>
              <div className={styles.swap}>
                <select
                  value={newCoin}
                  onChange={(e) => setNewCoin(e.target.value)}
                >
                  <option value="">Choose</option>
                  {cryptos.map((e) => (
                    <option value={e.symbol} key={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
                <span
                  className="action"
                  onClick={() => {
                    handleTop({ qty: parseFloat(qty), newCoin });
                  }}
                >
                  Swap
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.head}>
            <h1>Select a wallet to modify</h1>
          </div>
        )}
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
