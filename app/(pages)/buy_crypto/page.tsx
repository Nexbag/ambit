import Image from "next/image";

import styles from "./Exchange.module.scss";
import Link from "next/link";
import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";

interface Brookers {
  link: string;
}
const BuyBtc: React.FC = (): JSX.Element => {
  const brookers: Brookers[] = [
    {
      link: "paxful.com",
    },
    {
      link: "coinmama.com",
    },
    {
      link: "digatrade.com",
    },
    {
      link: "24xbtc.com",
    },
    {
      link: "hitbtc.com",
    },
    {
      link: "bit2me.comen",
    },
    {
      link: "coinmate.io",
    },
    {
      link: "bitcoin.de",
    },
    {
      link: "cex.io",
    },
    {
      link: "cubits.com",
    },
    {
      link: "wemovecoins.com",
    },
    {
      link: "quoine.com",
    },
    {
      link: "coinfloor.co",
    },
    {
      link: "bitfinex.com",
    },
    {
      link: "bitnovo.com",
    },
    {
      link: "lakebtc.com",
    },
  ];
  const topperData: TopperType = {
    title: "Purchase Cryptocurrency",

    text: [
      "For a stressfree experience, we have sorted out some good platforms where you can purchase cryptocurrencies.",
    ],
  };

  return (
    <>
      <Topper data={topperData} />
      <div className={styles.main}>
        <div className={styles.text}>
          <h1>
            Simply follow the link to purchase USDT neccessary for mining.
          </h1>
          <p>
            To get started, you need to buy a crypto currency that is worth the
            investment plan that you are interested in. We accept USDT, BTC,
            Ethereum, BNB and other major cryptocurrencies. Choose and broker
            from below to complete your purchase.
          </p>
        </div>
        <div className={styles.brookers} id="brookers">
          {brookers.map((brooker, index) => {
            return (
              <Link href={`https://${brooker.link}`} key={index}>
                <Image
                  src={`/exchange/exchenger-${index + 1}.png`}
                  fill
                  alt="buy bitcoin"
                />
                <span>{brooker.link}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default BuyBtc;
