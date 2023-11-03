"use client"
import styles from "./stock.module.scss"
import React, { useEffect,  } from 'react';

export default function StcokScreen() {
 

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "exchanges": [],
          "dataSource": "SPX500",
          "grouping": "sector",
          "blockSize": "market_cap_basic",
          "blockColor": "change",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "dark",
          "hasTopBar": false,
          "isDataSetEnabled": false,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "width": "100%",
          "height": "100%"
        }`;
     const container = document.getElementById("container7") as HTMLDivElement;
     container.appendChild(script)
    },
    []
  );

  return (
    <div className={` ${styles.main}`} >
    <div className={`tradingview-widget-container ${styles.box}`} id='container7' >
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright" style={{display:"none"}}><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
    </div>
  );
}

