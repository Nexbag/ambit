"use client";
import {
  BonusResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
import styles from "./styles.module.scss";
import { useUserContext } from "@/app/components/js/Wrapper";
import { useState } from "react";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import showMessage from "@/app/components/js/showError";
import { bonusUrl } from "@/app/components/js/config";
import Paginate from "@/app/components/js/pager/Paginate";
import Spinner from "@/app/components/js/spinner/Spinner";

export function Body({
  bonuses,
  users,
}: {
  bonuses: BonusResponseType[];
  users: UserResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;

  const [pageBonuses, setPageBonuses] = useState<BonusResponseType[]>([]);
  const [foundBonus, setFoundBonus] = useState<BonusResponseType>();
  const [status, setStatus] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleBonus = async (event: number = 0) => {
    if (event === 1) {
      setMessage("Please wait...");
      const { data, success, message } = await postRequest(
        bonusUrl,
        {
          amount,
          username,
          redeemAmount,
        },
        `${user?.token}`
      );
      {
        success && setPageBonuses((e) => [...e, data]);
      }
      showMessage(setMessage, message);
    } else if (event === 2) {
      setMessage("Please wait...");

      const { success, message } = await putRequest(
        bonusUrl + foundBonus?._id,
        {
          status,
        },
        `${user?.token}`
      );
      {
        success &&
          setPageBonuses((e) =>
            e.filter((bon) => {
              bon.status = bon._id == foundBonus?._id ? status : bon.status;
              return bon;
            })
          );
      }

      showMessage(setMessage, message);
    }
  };

  return (
    <div className={styles.main}>
      {bonuses.length == 0 && <p>You have not give any bonus yet</p>}

      <div className={styles.table}>
        <div className={styles.row}>
          <span>Date</span>
          <span>Username</span>
          <span>Amount</span>
          <span>Redeem Amount</span>

          <span>Status</span>

          <span>Action</span>
        </div>
        {pageBonuses.map((bonus) => {
          return (
            <div className={styles.row} key={bonus._id}>
              <span>{bonus.createdAt.split("T")[0]} </span>
              <span>{bonus.username.toUpperCase()} </span>
              <span>$ {bonus.amount.toLocaleString("USA")} </span>
              <span>$ {bonus.redeemAmount?.toLocaleString("USA")} </span>
              <select defaultValue={bonus.status} disabled={true}>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="-1">Cancelled</option>
              </select>

              <button
                onClick={() => setFoundBonus(bonus)}
                className={styles.action}
              >
                Modify
              </button>
            </div>
          );
        })}
      </div>
      <Paginate data={bonuses} setData={setPageBonuses} />
      {foundBonus ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Bonus Amount</label>
          <input type="number" value={foundBonus.amount} disabled={true} />
          <label>Redeem Amount</label>
          <input
            type="number"
            value={foundBonus.redeemAmount}
            disabled={true}
          />
          <label>Username</label>
          <input type="text" value={foundBonus.username} disabled={true} />
          <label>Status</label>

          <select
            onChange={(e) => {
              setStatus(parseInt(e.target.value));
            }}
            defaultValue={foundBonus.status}
          >
            <option value="1">Approved</option>
            <option value="0">Pending</option>
            <option value="-1">Cancelled</option>
          </select>
          <button
            onClick={() => handleBonus(2)}
            disabled={
              status == 0 ||
              status == foundBonus.status ||
              foundBonus.status == -1
            }
          >
            Update Status
          </button>
        </form>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <label>Enter bonus amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
          <label>Enter Redeem amount</label>
          <input
            type="number"
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(parseFloat(e.target.value))}
          />
          <label>Select User</label>
          <select
            onChange={(e) => {
              setUsername(
                () =>
                  users.find((user) => user.username == e.target.value)
                    ?.username || ""
              );
            }}
            value={username}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user.username}>
                {user.username.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleBonus(1)}
            disabled={username.length < 3 || amount < 3 || redeemAmount < 3}
          >
            Give Bonus
          </button>
        </form>
      )}
      {message && <Spinner error={message} />}
    </div>
  );
}
