"use client";

import { useUserContext } from "@/app/components/js/Wrapper";
import styles from "./styles.module.scss";
import { Countries } from "@/app/components/js/countries";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { KYCResponseType } from "@/app/components/js/dataTypes";
import { uploadFile } from "@/app/components/js/firebaseconfig";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import showMessage from "@/app/components/js/showError";
import { kycUrl } from "@/app/components/js/config";
import Paginate from "@/app/components/js/pager/Paginate";
import Spinner from "@/app/components/js/spinner/Spinner";
export default function Body({ kycs: data }: { kycs: KYCResponseType[] }) {
  const context = useUserContext();
  const user = context?.user;
  const [country, setCountry] = useState<string>(user?.country || Countries[0]);
  const [state, setState] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [pageKycs, setPageKycs] = useState<KYCResponseType[]>([]);
  const [kycs, setKycs] = useState<KYCResponseType[]>(data);
  const router = useRouter();
  const submitKyc = async () => {
    setMessage("please wait...");
    if (user?.kyc) {
      setMessage("You have completed your KYC");
      router.replace("/dashboard");
      return;
    }
    const date = new Date();
    const images = await uploadFile(`KYC ${date.getTime()}`, "form");

    const { message, success } = await postRequest(
      kycUrl,
      {
        username: user?.username,
        country,
        state,
        image: images[0],
        image2: images[1],
      },
      `${user?.token}`
    );

    showMessage(setMessage, message);

    success && router.replace("/dashboard");
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };
  const handleKyc = async (id: string, status: number) => {
    setMessage("please wait...");

    const { message, success } = await putRequest(
      `${kycUrl}${id}`,
      {
        status,
      },
      `${user?.token}`
    );
    const mod = kycs.map((e) => {
      e.status = e._id == id ? status : e.status;
      return e;
    });
    {
      success && setKycs(mod);
    }
    showMessage(setMessage, message);
  };

  return (
    <div className={styles.main}>
      <h1>KYC SECTION</h1>
      {user?.admin ? (
        <div className={styles.table}>
          <div className={styles.row}>
            <span>Date</span>
            <span>Username</span>
            <span>Country</span>
            <span>State</span>
            <span>Status</span>
            <span>View Front Image</span>
            <span>View Back Image</span>
            <span>Update</span>
          </div>
          {pageKycs.map((kyc) => {
            return (
              <div className={styles.row} key={kyc._id}>
                <span>{kyc.createdAt.split("T")[0]}</span>

                <span>{kyc.username.toUpperCase()}</span>
                <span>{kyc.country}</span>
                <span>{kyc.state}</span>
                <select defaultValue={kyc.status} id={kyc._id}>
                  <option value="-1">Failed</option>
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                </select>
                <a
                  href={kyc.image || ""}
                  target={"_blank"}
                  rel={"noreferrer noopener"}
                  className={styles.action}
                >
                  View Passport
                </a>
                <a
                  href={kyc.image2 || ""}
                  target={"_blank"}
                  rel={"noreferrer noopener"}
                  className={styles.action}
                >
                  View ID Image
                </a>

                <button
                  onClick={() => {
                    const ele = document.getElementById(
                      kyc._id
                    ) as HTMLSelectElement;
                    const val = parseInt(ele.value);
                    handleKyc(kyc._id, val);
                  }}
                  className={styles.action}
                >
                  Update
                </button>
              </div>
            );
          })}
        </div>
      ) : !user?.kyc ? (
        <form onSubmit={(e) => e.preventDefault()} id="form">
          <label>Country</label>
          <select onChange={(e) => setCountry(e.target.value)} value={country}>
            {Countries.map((country, i) => (
              <option key={i} value={country}>
                {country}
              </option>
            ))}
          </select>
          <label>State</label>
          <input
            type={"text"}
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <label>Upload Passport Picture </label>
          <input type={"file"} accept={"image/*"} />
          <label>Upload ID </label>
          <input type={"file"} accept={"image/*"} />
          <button onClick={() => submitKyc()}>Submit KYC</button>
        </form>
      ) : (
        <form>
          <h3>Congratulations!</h3>
          <p>You have completed your KYC verification</p>
        </form>
      )}
      {user?.admin && <Paginate data={kycs} setData={setPageKycs} />}
      {message && <Spinner error={message} />}
    </div>
  );
}
