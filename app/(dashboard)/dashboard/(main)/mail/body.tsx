"use client";
import styles from "./styles.module.scss";
import { useUserContext } from "@/app/components/js/Wrapper";
import { postRequest } from "@/app/components/js/api_client";
import { mailerUrl } from "@/app/components/js/config";
import {
  MailProp,
  TransactionResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import { useState } from "react";

export default function Body({
  transactions,
  users,
}: {
  transactions: TransactionResponseType[];
  users: UserResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [single, setSingle] = useState<boolean>(false);

  const sendMail = async (re: number) => {
    setError("sending...");

    const mailUsers = async () => {
      if (re == 1) {
        return users.filter(
          (user) => user.email.includes("@") && user.email.includes(email)
        );
      }

      if (re == 4) {
        return users.filter((user) => user.email.includes("@"));
      }

      const userz: UserResponseType[] = [];

      users.forEach((user) => {
        const found = transactions.find(
          (transaction) => transaction.username == user.username
        );
        if (!found && user.email.includes("@") && re == 2 && !user.disabled)
          userz.push(user);
        if (found && user.email.includes("@") && re == 3 && !user.disabled)
          userz.push(user);
      });

      return userz;
    };
    const users2Send = await mailUsers();
    const mailData: MailProp = { emails: [] };
    users2Send.forEach((user, i) => {
      if (i <= 200)
        mailData.emails.push({
          email: {
            email: user.email,
            name: user.username,
          },
          subject,
          username: user.username,
          messageData: `<p>${message}</p>`,
        });
    });

    const { message: text } = await postRequest(
      mailerUrl,
      mailData,
      `${user?.token}`
    );
    showMessage(setError, text);
  };
  return (
    <div className={styles.main}>
      <div className={styles.col}>
        <h1>Send Newsletter</h1>
        <p>Please do not bill clients here to avoid suspension.</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="Message">Type your message</label>
          <input
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            value={subject}
          />
          <textarea
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button
            disabled={!subject || !message}
            onClick={() => {
              sendMail(4);
            }}
          >
            Send To All
          </button>
          <button
            disabled={!subject || !message}
            onClick={() => {
              sendMail(2);
            }}
          >
            Send To Clients that have not made Deposit
          </button>
          <button
            disabled={!subject || !message}
            onClick={() => {
              sendMail(3);
            }}
          >
            Send To Clients that have made Deposit
          </button>
          <button
            disabled={!subject || !message}
            onClick={() => {
              setSingle(true);
            }}
          >
            Send To Specific Client
          </button>
          {single && <label htmlFor="user">Select User</label>}
          {single && (
            <select
              onChange={(e) => setEmail(() => e.target.value)}
              value={email}
            >
              <option value="">Select User</option>
              {users.map((uz) => (
                <option value={uz.email} key={uz._id}>
                  {uz.username.toUpperCase()}
                </option>
              ))}
            </select>
          )}
          {single && (
            <button
              disabled={
                !subject || !message || email.length < 3 || !email.includes("@")
              }
              onClick={() => {
                sendMail(1);
              }}
            >
              Send
            </button>
          )}
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
}
