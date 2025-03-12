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
export const revalidate = 60;
export default async function Page() {
  const pl = (await fetchData()) as InvestmentPlanResponseType[];
  const plans = pl || [];
  const data: TopperType = {
    title: "Your Trusted Partner for Smart Investments",
    text: [
      "We empower you to take control of your financial future through our diversified investment portfolio. Discover how you can potentially grow your wealth by investing with us.",
      "At Amber Trade, we combine expertise, innovation, and a commitment to excellence to offer you success-proven investment opportunities.",
    ],
  };
  const texts: { title: string; texts: string[] }[] = [
    {
      title: "Diversified Portfolio Management",
      texts: [
        "Amber Trade strategically diversifies investments across multiple asset classes, including cryptocurrencies, stocks, gold, and real estate. By carefully managing asset allocation, we aim to optimize returns while minimizing risks for our clients.",
      ],
    },
    {
      title: "Data-Driven Investment Decisions",
      texts: [
        "Our team of expert analysts and data scientists conducts comprehensive market research and analysis, leveraging advanced data analytics and technology to make informed investment decisions that drive profitable outcomes.",
      ],
    },
    {
      title: "Strategic Positioning in Cryptocurrency",
      texts: [
        "With a profound understanding of the cryptocurrency market, Amber Trade leverages market volatility and growth potential. Our experienced traders and advanced algorithms enable us to strategically position investments for maximum returns while effectively managing associated risks.",
      ],
    },
    {
      title: "Value-Based Stock Investments",
      texts: [
        "Amber Trade identifies undervalued stocks and promising companies through meticulous research and fundamental analysis. Our investment experts closely monitor market trends, ensuring that our clients benefit from investment opportunities aligned with their financial goals.",
      ],
    },
    {
      title: "Optimized Gold Trading Strategies",
      texts: [
        "Drawing on our expertise in the gold market, Amber Trade implements optimized trading strategies to capitalize on market fluctuations and price movements. Our diligent monitoring of global economic trends and geopolitical developments ensures timely and strategic decisions in gold trading.",
      ],
    },
    {
      title: "Sustainable Real Estate Investments",
      texts: [
        "Amber Trade focuses on sustainable projects with long-term growth potential. Our emphasis on investing in properties that offer value appreciation and stable returns ensures that our clients benefit from a resilient and diversified investment portfolio.",
      ],
    },

    {
      title: "Where you come in",
      texts: [
        `In order to remain a top force in the industry, Amber Trade must manage these operational costs. We use the capital you invest to maintain our operations and distribute the total profits earned from the investments.`,
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
          <p>{`Transparency and value creation are fundamental aspects of our investment approach. We are dedicated to empowering our clients with a comprehensive understanding of how we generate profits. Here's a breakdown of our investment strategies, designed to ensure your financial success:`}</p>
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
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}%`}
                    </p>
                    <span>Daily Profit</span>
                  </div>
                  <span className={styles.name}>{plan.name.toUpperCase()}</span>
                  <ShowText
                    name="Minimum Deposit"
                    value={`$${plan.minimum.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                  <ShowText
                    name="Maximum Deposit"
                    value={`$${plan.maximum.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                  <ShowText
                    name="Contract Duration"
                    value={`${plan.duration.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} Day(s)`}
                  />
                  <ShowText
                    name="Referral Bonus"
                    value={`${plan.refCommission.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%`}
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
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}%`}
                    </p>
                    <span>Daily Profit</span>
                  </div>
                  <span className={styles.name}>{plan.name.toUpperCase()}</span>
                  <ShowText
                    name="Minimum Deposit"
                    value={`$${plan.minimum.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                  <ShowText
                    name="Maximum Deposit"
                    value={`$${plan.maximum.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  />
                  <ShowText name="Contract Duration" value={`Life Time`} />
                  <ShowText
                    name="Referral Bonus"
                    value={`${plan.refCommission.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%`}
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
