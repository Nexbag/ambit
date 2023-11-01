"use client";
import { useEffect } from "react";
import styles from "./Screen.module.scss";
export default function Screen() {
  let hasLoad = false;
  useEffect(() => {
    if (!hasLoad) {
      const body = document.querySelector("#screen")!;
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `{
  "width": "100%",
  "height": "100%",
  "defaultColumn": "overview",
  "screener_type": "crypto_mkt",
  "displayCurrency": "USD",
  "colorTheme": "dark",
  "locale": "en",
  "isTransparent": true
}`;
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";

      body.appendChild(script);
      hasLoad = true;
    }
  }, []);

  return (
    <div className={styles.screen}>
      <div className="tradingview-widget-container" id="screen">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
