"use client";

import { MdOutlinePending } from "react-icons/md";
import { FcApproval, FcCancel } from "react-icons/fc";
import {
  TransactionResponseType,
  UserResponseType,
} from "@/app/components/js/dataTypes";
import { getRequest, putRequest } from "@/app/components/js/api_client";
import { useUserContext } from "@/app/components/js/Wrapper";
import {
  COMPANYNAME,
  transactionUrl,
  usersUrl,
} from "@/app/components/js/config";
import { useState } from "react";
import styles from "./styles.module.scss";
import Spinner from "@/app/components/js/spinner/Spinner";
import showError from "@/app/components/js/showError";
import Paginate from "@/app/components/js/pager/Paginate";

import { useRouter } from "next/navigation";
export const Body: React.FC<{
  transactionz: TransactionResponseType[];
}> = ({ transactionz }) => {
  const context = useUserContext();
  const user = context?.user;
  const [error, setError] = useState<string>("");
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [amount, setAmount] = useState<string>("100");
  const [users, setUsers] = useState<UserResponseType[]>([]);

  const router = useRouter();
  const [transactions, setTransactions] =
    useState<TransactionResponseType[]>(transactionz);
  const [pageTransactions, setPageTransactions] = useState<
    TransactionResponseType[]
  >([]);

  const handleStatus = async (id: string, status: number) => {
    if (!user?.admin) return;
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${transactionUrl}${id}`,
      { transfer: status },
      `${user?.token}`
    );
    showError(setError, message);
    if (success) {
      setTransactions((e) =>
        e.map((c) => {
          c.status = c._id == id ? status : c.status;
          return c;
        })
      );
    }
  };
  const handleTransfer = async () => {
    if (user?.admin || parseFloat(amount) <= 0) return;
    setError("Please wait...");
    const { success, message } = await putRequest(
      `${usersUrl}${username}`,
      { amount: parseFloat(amount) },
      `${user?.token}`
    );

    showError(setError, message);
    if (success) {
      router.replace("/dashboard/transactions");
    }
  };
  const handleSearch = async () => {
    if (searchUsername.length < 4) return;
    setError("Please wait...");
    const { message, data } = await getRequest(
      `${usersUrl}?username=${searchUsername}`,

      `${user?.token}`
    );
    showError(setError, message);

    setUsers(data || []);
  };

  return (
    <div className={styles.transactions}>
      <h1>{user?.admin ? "Manage Tranfers" : "Tranfer"}</h1>
      {user?.admin ? (
        <div className={styles.table}>
          {pageTransactions.map((tran) => (
            <div key={tran._id} className={styles.transaction}>
              <div className={styles.icon}>
                {tran.status == 1 && (
                  <span style={{ color: "green" }}>
                    <FcApproval />
                  </span>
                )}
                {tran.status == 0 && (
                  <span style={{ color: "var(--pl)" }}>
                    <MdOutlinePending />
                  </span>
                )}
                {tran.status == -1 && (
                  <span style={{ color: "var(--s)" }}>
                    <FcCancel />
                  </span>
                )}
              </div>
              <div className={styles.desc}>
                <p>
                  Transfer from
                  {tran.type == 1 ? tran.wallet : tran.username} to{" "}
                  {tran.type == 0 ? tran.wallet : tran.username} via {tran._id}{" "}
                  on {COMPANYNAME} network.
                </p>
                <p>
                  <span>{tran.username.toUpperCase()} &nbsp;</span>

                  <span>{tran.createdAt.split("T")[0]}</span>
                </p>
              </div>
              <div className={styles.info}>
                <p className={styles.amount}>
                  {tran.type == 0 && tran.status == 1 && "-"}$
                  {tran.amount.toLocaleString("USA")}
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => handleStatus(tran._id, 1)}
                  className={styles.action}
                  disabled={tran.status == 1}
                >
                  Approve
                </button>
                <button
                  className={styles.action}
                  disabled={tran.status == -1}
                  onClick={() => handleStatus(tran._id, -1)}
                >
                  Disapprove
                </button>
              </div>
            </div>
          ))}

          <Paginate data={transactions} setData={setPageTransactions} />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTransfer();
          }}
          id="form"
        >
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(() => e.target.value)}
          />
          <label>Username</label>
          <input
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(() => e.target.value)}
          />
          <span className="action2" onClick={handleSearch}>
            Search
          </span>
          {users.length > 0 && <label htmlFor="SelCoin">Choose</label>}
          {users.length > 0 && (
            <select
              id="SelCoin"
              value={username}
              onChange={(e) =>
                setUsername(() => {
                  const found = users.find(
                    (uzer) => uzer.username == e.target.value
                  );
                  return found?.username || "";
                })
              }
            >
              <option value="">Choose User</option>
              {users.map((uzer) => (
                <option value={uzer.username} key={uzer._id}>
                  {uzer.username.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          <button
            disabled={
              username.length < 2 ||
              parseFloat(amount) < 0 ||
              parseFloat(amount) > (user?.balance || 0)
            }
          >
            Transfer
          </button>
        </form>
      )}

      {error && <Spinner error={error} />}
    </div>
  );
};

export default Body;
