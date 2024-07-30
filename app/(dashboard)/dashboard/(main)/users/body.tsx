"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import { UserResponseType } from "@/app/components/js/dataTypes";
import { getRequest, putRequest } from "@/app/components/js/api_client";
import { usersUrl } from "@/app/components/js/config";
import { useUserContext } from "@/app/components/js/Wrapper";
import showError from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";

export const Members: React.FC<{ users: UserResponseType[] }> = ({
  users: userz,
}) => {
  const context = useUserContext();
  const user = context?.user;
  const [users, setUsers] = useState<UserResponseType[]>(userz);
  const fetchData = async (username?: string) => {
    const { data } = await getRequest(
      username ? `${usersUrl}?username=${username}` : usersUrl,
      user?.token
    );

    if (data) setUsers(data);
  };

  return (
    <div className={styles.members}>
      <h1>Clients</h1>
      <div className={styles.search}>
        <form>
          <input
            type="text"
            placeholder="enter username..."
            onChange={(e) => fetchData(e.target.value)}
          />
        </form>
      </div>
      <div className={styles.table}>
        <div className={styles.row}>
          <span>Username</span>
          <span>Email</span>

          <span>View</span>
          <span>See Referrals</span>
        </div>
        {users.map((uzer) => {
          return (
            <div key={uzer._id} className={styles.row}>
              <span>{uzer.username.toUpperCase()}</span>
              <span>{uzer.email}</span>

              <Link className={"action2"} href={`/dashboard/users/${uzer._id}`}>
                See More
              </Link>
              <Link
                className={"action2"}
                href={`/dashboard/referrals?username=${uzer.username}`}
              >
                See More
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const UpdateMember: React.FC<{
  foundUser: UserResponseType;
  balance: number;
  systemBalance: number;
}> = ({ foundUser, balance, systemBalance }) => {
  const context = useUserContext();
  const user = context?.user;

  const [amount, setAmount] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const handleUser = async (disabled: boolean) => {
    setError("Please wait ...");

    const { message, success } = await putRequest(
      `${usersUrl}${foundUser._id}`,
      {
        disabled,
      },
      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };
  const handleFunding = async (add = true) => {
    setError("Please wait ...");

    const { message, success } = await putRequest(
      `${usersUrl}${foundUser._id}`,
      {
        amount: (add ? 1 : -1) * parseFloat(amount),
      },
      user?.token
    );

    showError(setError, message);
    if (success) location.reload();
  };

  return (
    <div className={styles.members}>
      <div className={styles.container}>
        <form id="form">
          <h1>UPDATE {foundUser.username.toUpperCase()}</h1>
          <label htmlFor="email">Email</label>
          <input type="text" value={foundUser.email} disabled />
          <label htmlFor="Username">Username</label>
          <input type="text" value={foundUser.username} disabled />
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            value={foundUser.name + " " + foundUser.oNames}
            disabled
          />
          <label>Password</label>
          <input type="text" value={foundUser.password} disabled />
          <label htmlFor="kyc">KYC status</label>
          <input
            type="text"
            value={foundUser.verified ? "Completed" : "Pending"}
            disabled
          />
          <label htmlFor="tel">Phone No</label>
          <input type="text" value={foundUser.tel} disabled />

          <label htmlFor="status">User Status</label>
          <select value={foundUser.disabled ? "true" : "false"} disabled>
            <option value="true">Banned</option>
            <option value="false">Approved User</option>
          </select>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleUser(!foundUser.disabled);
            }}
          >
            {foundUser.disabled ? "Unsuspend User" : "Suspend User"}
          </button>
        </form>

        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Funding</h2>
          <label>Available Balance</label>
          <input type="number" defaultValue={balance} disabled />
          <label>System Balance</label>
          <input type="number" defaultValue={systemBalance} disabled />
          <label htmlFor="Amount">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(() => e.target.value)}
          />

          <div>
            <button onClick={() => handleFunding(true)}>Fund</button>
            <button onClick={() => handleFunding(false)}>Deduct</button>
          </div>
        </form>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
};

export default Members;
