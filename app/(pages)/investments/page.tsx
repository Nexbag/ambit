import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import styles from "./styles.module.scss";
import { getRequest } from "@/app/components/js/api_client";
import { investmentPlanUrl } from "@/app/components/js/config";
import { InvestmentPlanResponseType } from "@/app/components/js/dataTypes";
import Link from "next/link";
const fetchData = async () => {
  try {
    const data = await getRequest(investmentPlanUrl);
    return data ? data.data || [] : [];
  } catch (error) {
    return [];
  }
};

export default async function Page() {
  const pl = (await fetchData()) as InvestmentPlanResponseType[];
  const plans = pl || [];
  const data: TopperType = {
    title: "Your Trusted Partner for Smart Investments",
    text: [
      "We empower you to take control of your financial future through cryptocurrency mining. Discover how you can potentially grow your wealth by investing with us.",
      "At Amber Trade, we combine expertise, innovation, and a commitment to excellence to offer you investment opportunities in cryptocurrency mining.",
    ],
   
  };
  const texts: { title: string; texts: string[] }[] = [
    {
      title: "Acquisition of Mining Hardware",
      texts: [
        "Amber Trade invests in specialized hardware known as mining rigs. These rigs are equipped with powerful processors (such as ASICs or GPUs) that are specifically designed to perform the complex calculations required for cryptocurrency mining. The company may also invest in other infrastructure such as cooling systems and secure facilities to support the mining operations.",
      ],
    },
    {
      title: "Network Participation",
      texts: [
        "The cryptocurrency mining process involves validating and adding new transactions to the blockchain ledger. Miners compete to solve complex mathematical puzzles, and the first one to solve it gets the opportunity to add a new block of transactions to the blockchain.",
      ],
    },
    {
      title: "Proof-of-Work (PoW)",
      texts: [
        `Many cryptocurrencies, including Bitcoin, use a consensus mechanism called Proof-of-Work (PoW). In PoW, miners must demonstrate that they have expended computational power to solve these puzzles. This proof is known as a "proof-of-work."`,
      ],
    },
    {
      title: "Transaction Fees and Block Rewards",
      texts: [
        `Miners are rewarded for their efforts in two ways:`,
        `a. ransaction Fees: Users of the cryptocurrency pay fees when making transactions. These fees are collected by miners when they include a transaction in a block.`,
        `b. Block Rewards: In addition to transaction fees, miners receive a reward in the form of newly created cryptocurrency coins. This is often referred to as the "block reward." The reward amount and issuance schedule vary depending on the cryptocurrency.`,
      ],
    },
    {
      title: "Mining Pools",
      texts: [
        `Cryptocurrency mining can be highly competitive, and it may take a considerable amount of computational power to successfully mine a block, especially for cryptocurrencies like Bitcoin. To increase their chances of earning rewards, miners often join mining pools. Mining pools are groups of miners who combine their computing power to collectively solve puzzles and share the rewards proportionally based on their contributions.`,
      ],
    },
    {
      title: "Selling Mined Cryptocurrency",
      texts: [
        ` Once Amber Trade successfully mines cryptocurrency, they can choose to hold it as an investment or sell it on cryptocurrency exchanges to convert it into traditional fiat currency, such as US dollars or euros. The proceeds from selling mined cryptocurrency contribute to the company's revenue.`,
      ],
    },
    {
      title: "Reinvestment and Expansion",
      texts: [
        `Amber Trade may reinvest some of its earnings to acquire additional mining hardware or improve its existing infrastructure. This reinvestment can increase the company's mining capacity, potentially leading to higher earnings over time.`,
      ],
    },
    {
      title: "Profit Margin and Operating Costs",
      texts: [
        `The profitability of cryptocurrency mining depends on several factors, including the cost of electricity, hardware maintenance, and the current market price of the mined cryptocurrency. Amber Trade must manage these operating costs to maintain a healthy profit margin.`,
      ],
    },
    {
      title: "Where you come in",
      texts: [
        `In order to remain a top miner in the industry, Amber Trade must manage these operational costs. We use the capital you invest to maintain our operations and distribute the total profits earned from mining.`,
      ],
    },
  ];
  function ShowText({ name, value }: { name: string; value: string }) {
    return (
      <div>
        <p>{value}</p>
        <span>{name}</span>
      </div>
    );
  }
  return (
    <main>
      <Topper data={data} />
      <div className={styles.main}>
        <section className={styles.container}>
          <p>{`Amber Trade generates money through cryptocurrency trading and mining by participating in the process of validating transactions on blockchain networks and earning rewards in the form of cryptocurrencies. Here's how this process works:`}</p>
          {texts.map((e, i) => (
            <div className={styles.content} key={i}>
              <h3>{e.title}</h3>
              <ul>
                {e.texts.map((e, k) => (
                  <li key={k}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section className={styles.box}>
          <h1>INVESTMENT PLANS</h1>
          <div className={styles.plans}>
            {plans
              .filter((plan) => !plan.share)
              .map((plan) => (
                <div className={styles.plan} key={plan._id}>
                  <div className={styles.top}>
                    <p>
                      {`${(
                        (plan.interest * 100) /
                        plan.duration
                      ).toLocaleString("USA")}%`}
                    </p>
                    <span>Daily Profit</span>
                  </div>
                  <span className={styles.name}>{plan.name.toUpperCase()}</span>
                  <ShowText
                    name="Minimum Deposit"
                    value={`$${plan.minimum.toLocaleString("USA")}`}
                  />
                  <ShowText
                    name="Maximum Deposit"
                    value={`$${plan.maximum.toLocaleString("USA")}`}
                  />
                  <ShowText
                    name="Contract Duration"
                    value={`${plan.duration.toLocaleString("USA")} Day(s)`}
                  />
                  <ShowText
                    name="Referral Bonus"
                    value={`${plan.refCommission.toLocaleString("USA")}%`}
                  />
                  <Link
                    href={"/dashboard/invesments/invest"}
                    className="action"
                  >
                    Invest
                  </Link>
                </div>
              ))}
            {plans
              .filter((plan) => plan.share)
              .map((plan) => (
                <div className={styles.plan} key={plan._id}>
                  <div className={styles.top}>
                    <p>
                      {`${(
                        (plan.interest * 100) /
                        plan.duration
                      ).toLocaleString("USA")}%`}
                    </p>
                    <span>Daily Profit</span>
                  </div>
                  <span className={styles.name}>{plan.name.toUpperCase()}</span>
                  <ShowText
                    name="Minimum Deposit"
                    value={`$${plan.minimum.toLocaleString("USA")}`}
                  />
                  <ShowText
                    name="Maximum Deposit"
                    value={`$${plan.maximum.toLocaleString("USA")}`}
                  />
                  <ShowText name="Contract Duration" value={`Life Time`} />
                  <ShowText
                    name="Referral Bonus"
                    value={`${plan.refCommission.toLocaleString("USA")}%`}
                  />
                  <Link
                    href={"/dashboard/invesments/invest"}
                    className="action"
                  >
                    Invest
                  </Link>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
