"use client";
import { useUserContext } from "@/app/components/js/Wrapper";
import styles from "./styles.module.scss";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import { cryptoUrl } from "@/app/components/js/config";
import { useState, FormEvent } from "react";
import { uploadFile } from "@/app/components/js/firebaseconfig";
import {
  CryptoResponseType,
  RawCryptoResponseType,
} from "@/app/components/js/dataTypes";
import showMessage from "@/app/components/js/showError";
import Paginate from "@/app/components/js/pager/Paginate";
import Spinner from "@/app/components/js/spinner/Spinner";
export default function Body({
  cryptos,
  market,
}: {
  cryptos: CryptoResponseType[];
  market: RawCryptoResponseType[];
}) {
  const context = useUserContext();
  const user = context?.user;
  const [name, setName] = useState<string>("");
  const [ref, setRef] = useState<string>("ethereum");
  const [symbol, setSymbol] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [pageCryptos, setPageCryptos] = useState<CryptoResponseType[]>(cryptos);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("Please wait...");
    const images = await uploadFile(name, "form");
    const { data, success, message } = await postRequest(
      cryptoUrl,
      {
        name,
        symbol: symbol.toLowerCase(),
        currentPrice: parseFloat(currentPrice),
        image: images[0],
        ref,
      },
      user?.token
    );
    showMessage(setMessage, message);
    success && setPageCryptos((e) => [data, ...e]);
  };
  const handleUpdate = async (id: string) => {
    setMessage("Please wait...");
    const input = document.getElementById(id) as HTMLInputElement;
    const refInput = document.getElementById(`${id}ref`) as HTMLInputElement;
    const currentPrice = parseFloat(input.value || "0");
    const ref = refInput.value;

    const { success, message } = await putRequest(
      `${cryptoUrl}${id}`,
      {
        currentPrice,
        ref,
      },
      user?.token
    );
    showMessage(setMessage, message);
    if (success) {
      const all = pageCryptos.map((e) => {
        e.currentPrice = e._id == id ? currentPrice : e.currentPrice;
        return e;
      });
      setPageCryptos(all);
    }
  };
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <h1>Create Token</h1>
        <form onSubmit={handleCreate} id="form">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />

          <label>Price</label>
          <input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
          />
          <label>Reference</label>
          <select value={ref} onChange={(e) => setRef(e.target.value)}>
            <option value="">Select</option>
            {market.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <label>Image</label>
          <input type="file" accept="image/*" />

          <button>Create Token</button>
        </form>
      </div>
      <div className={styles.right}>
        <h1>Manage Token</h1>
        <div className={styles.table}>
          <div className={styles.row}>
            <span>Name</span>
            <span>Symbol</span>
            <span>Price</span>
            <span>Ref</span>
            <span>Update</span>
          </div>
          {pageCryptos.map((e) => (
            <div className={styles.row} key={e._id}>
              <span>{e.name}</span>
              <span>{e.symbol.toUpperCase()}</span>
              <input type="number" defaultValue={e.currentPrice} id={e._id} />
              <select id={`${e._id}ref`} defaultValue={e.ref}>
                <option value="">Select</option>
                {market.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <span className="action2" onClick={() => handleUpdate(e._id)}>
                Update
              </span>
            </div>
          ))}
        </div>
        <Paginate data={cryptos} setData={setPageCryptos} />
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
