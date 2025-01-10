import { useEffect } from "react";
import styles from "./Ticker.module.scss";
export default function Ticker({ theme = "light" }: { theme?: string }) {
  let make = true;

  useEffect(() => {
    if (make) {
      const body = document.querySelector("#contain12")!;
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

      script.type = "text/javascript";
      script.innerHTML = `{
  "symbols": [
    {
      "description": "Bitcoin",
      "proName": "BITGET:BTCUSDT"
    },
    {
      "description": "Ethereum",
      "proName": "BYBIT:ETHUSDT"
    },
    {
      "description": "BNB",
      "proName": "BINANCE:BNBUSDT"
    },
    {
      "description": "Solana",
      "proName": "BINANCE:SOLUSDT"
    },
    {
      "description": "Doge",
      "proName": "BINANCE:DOGEUSDT"
    },
   
    {
      "description": "Cake",
      "proName": "BINANCE:CAKEUSDT"
    },
    
    {
      "description": "Ordi",
      "proName": "BINANCE:ORDIUSDT"
    }
  ],
  "colorTheme": "${theme}",
  "isTransparent": true,
  "showSymbolLogo": true,
  "locale": "en"
}`;
      body.appendChild(script);
      make = false;
    }
  }, [make]);

  return (
    <div className={styles.ticker}>
      <div className="tradingview-widget-container notranslate" id="contain12">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
