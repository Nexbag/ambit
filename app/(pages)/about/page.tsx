import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import styles from "./styles.module.scss";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { SiSecurityscorecard } from "react-icons/si";
import { TbBrand4Chan } from "react-icons/tb";
import { GiLifeInTheBalance } from "react-icons/gi";
import { BiHappyBeaming } from "react-icons/bi";
import { Metadata } from "next";
import { COMPANYNAME } from "@/app/components/js/config";
import { BsLightning } from "react-icons/bs";
import { FaPeopleGroup } from "react-icons/fa6";
import Listed from "@/app/components/js/listed/listed";

export const metadata: Metadata = {
  title: `About ${COMPANYNAME}`,
  description: `Amber Trade is a digital platform that facilitates cryptocurrency trading, mining and investment opportunities for individuals and investors interested in cryptocurrencies.`,
};

export default function About() {
  const top: TopperType = {

    text: [
      `Amber Trade is a digital platform that facilitates cryptocurrency trading, mining and investment opportunities for individuals and investors interested in cryptocurrencies. The platform offers a range of investment plans designed to allow users to invest their capital into cryptocurrency mining operations.`,
    ],
    title: `About ${COMPANYNAME}`,
  };
  const texts: { title: string; text: string; icon: IconType }[] = [
    {
      icon: SiSecurityscorecard,
      title: "Security First",
      text: `Your financial safety is our top priority. ${COMPANYNAME} employs state-of-the-art security measures to protect your money and personal information. Rest easy knowing that your trust in us is well-placed.`,
    },
    {
      icon: TbBrand4Chan,
      title: "Comprehensive Services",
      text: "We offer a wide range of financial services to cater to all your needs. Whether you want to invest, mine, store and send cryptocurrencies, we've got you covered.",
    },
    {
      icon: BsLightning,
      title: "Lightning-Fast Transaction Speed",
      text: `We understand that time is of the essence in today's fast-paced world. With ${COMPANYNAME}, you can expect lightning-fast transaction speeds, ensuring your assets gets where it needs to be when it needs to be there.`,
    },
    {
      icon: GiLifeInTheBalance,
      title: "Stability and Trust",
      text: `In an ever-changing financial landscape, you need stability you can rely on. ${COMPANYNAME} has a proven track record of financial stability, giving you the peace of mind you deserve.`,
    },
    {
      icon: BiHappyBeaming,
      title: "User-Focused Experience",
      text: "Our platform is designed with you in mind. We prioritize user experience, making it easy for both beginners and experienced users to navigate our services seamlessly.",
    },
    {
      icon: FaPeopleGroup,
      title: "Community",
      text: `${COMPANYNAME} is not just a financial platform; we're a community of like-minded individuals striving for financial success. Join our community to connect with others, share insights, and learn from each other's experiences.`,
    },
  ];

const history:string[]=[
  "Since its inception in 2016 (Reg No.: 2366506), Amber Trade Limited has been at the forefront of the ever-evolving landscape of digital investments. Established as a subsidiary of the renowned Amber Group, our journey began with a sharp focus on forex trading. With a dedicated team of experts and a commitment to excellence, we swiftly established ourselves as a leading force in the financial markets.",
  "As the world of finance continued to undergo a paradigm shift, we recognized the immense potential of cryptocurrency trading. Leveraging our expertise and experience, we seamlessly transitioned into the realm of digital assets. This pivotal move marked a significant milestone in our journey, propelling us into a dynamic era of innovation and groundbreaking opportunities.",
  "Our contributions to the development of life-changing cryptocurrency projects are a testament to our unwavering commitment to driving technological advancements. From our early support of Solana to our involvement in numerous other groundbreaking initiatives, we have consistently fostered an environment conducive to transformative advancements in the crypto sphere.",
  "At Amber Trade, we have embraced cutting-edge technology, providing us with a distinct advantage in crypto mining and precise price predictions. Our dedicated team of technologists continuously explores the latest advancements, ensuring that we remain at the forefront of technological innovation in the crypto investment landscape.",
  "As we reflect on our journey so far, we remain steadfast in our dedication to pioneering the future of crypto investment. With an unwavering commitment to excellence and a relentless pursuit of innovation, we continue to redefine the boundaries of what's possible in the world of digital finance. Join us on this exciting journey and be a part of the future of crypto with Amber Trade."
]
const subsidiaries:{name:string;text:string;reg:string}[]=[
  {
name:"Amber Custodian Services Limited",
text:`Licensed as a Hong Kong Trust or Company Service Provider (“TCSP”) with the Companies Registry ("CR") in accordance with the Anti-Money Laundering and Counter-Terrorism Financing Ordinance Cap. 615 ("AMLO")`,
reg:"License No. TC007861"
  },
  {
name:"Amber Technologies Limited",
text:`Registered with the U.S. Department of Treasury Financial Crimes Enforcement Network (“FinCEN”) as a Money Services Business (“MSB”)`,
reg:"Registration No. 31000235878123"
  },
  {
name:"Amber Vault Aus Pty Ltd",
text:`Registered with the Australian Transaction Reports and Analysis Centre ("AUSTRAC") to provide Digital Currency Exchange ("DCE") services in accordance with the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 ("AML/CTF Act")`,
reg:"Registration No. 100777501-001"
  },
  {
name:"Whalefin Technologies Limited",
text:`Registered with the U.S. Department of Treasury Financial Crimes Enforcement Network (“FinCEN”) as a Money Services Business (“MSB”)`,
reg:"Registration No. 31000204803350"
  },
  {
name:"Amber Trade Limited",
text:`Licensed as a Hong Kong Trust or Company Service Provider (“TCSP”) with the Companies Registry ("CR") in accordance with the Anti-Money Laundering and Counter-Terrorism Financing Ordinance Cap. 615 ("AMLO")`,
reg:"License No. 2366506"
  },
  {
name:"Celera Markets Limited",
text:`Licensed with the Securities and Futures Commission ("SFC") in Hong Kong for Type 1 (Dealing in Securities), Type 4 (Advising on Securities), and Type 9 (Asset Management) regulated activities in accordance with the Securities and Futures Ordinance`,
reg:"License No. ARB697"
  },
  {
name:"Amber Fintech Switzerland GmbH",
text:`Member of the VQF Self-Regulatory Organization ("VQF SRO") under the Swiss Financial Market Supervisory Authority ("FINMA")`,
reg:""
  },
  {
name:"Sparrow Tech Private Limited",
text:`Licensed as a Major Payment Institution ("MPI") under the Payment Services Act 2019 to conduct the payment service of "Digital Payment Token Service"`,
reg:"License No. PS20200502"
  },
]
  return (
    <main>
      <Topper data={top} />
      <div className={styles.about}>
        <section>
          <h2>Our History</h2>
         {history.map((e,i)=><p key={i}>{e}</p>)}
        </section>
        <section>
          <h2>Our Mission</h2>
          <p>{`At ${COMPANYNAME}, our mission is to revolutionize cryptocurrency by harnessing the power of cutting-edge technology to provide our customers with unparalleled financial solutions. We are committed to building trust, delivering excellence, and empowering individuals and businesses to achieve their financial goals. Through innovation, transparency, and a relentless focus on customer-centric solutions, we aspire to be your number one platform for profitable investments.`}</p>

          <div className="links">
            <Link href={"/about/compliance_policy"} className="action">
              Compliance Policy
            </Link>
          </div>
        </section>
        <div className={styles.grid}>
          <h2>Core Strenths- {COMPANYNAME}</h2>
          {texts.map((e, i) => (
            <div key={i}>
              <h3>{e.title}</h3>
              <e.icon className={styles.icon} />
              <p>{e.text}</p>
            </div>
          ))}
        </div>
        <section>
          <h2>Our Vision</h2>
          <p>{`Our vision at ${COMPANYNAME} is to be a trailblazing force in the financial industry, setting new standards of excellence through technology-driven mining. We aim to create a seamless, secure, and personalized investment experience for every customer, while fostering financial inclusion and economic growth. By consistently pushing the boundaries of innovation and upholding the highest ethical standards, we aspire to be the catalyst for positive change in the lives of our customers, employees, and communities we serve. `}</p>
          <h3>{`A Promising Future`}</h3>
          <p>{`Looking ahead, Amber Trade remains steadfast in its mission to empower clients with the financial tools they need to thrive. The company's commitment to innovation, security, and transparency continues to drive its success as it explores new horizons in the ever-evolving world of finance.`}</p>
        </section>
        <div className={styles.subsidiaries}>
          <h2>The following licensed/registered entities are fully owned subsidiaries of Amber Group:</h2>

          <div className={styles.group}>
           {subsidiaries.map((e,i)=>(
            <div key={i}>
              <p>{e.name}</p>
              <p>{e.text}</p>
              <p>{e.reg}</p>
            </div>
           ))}
          </div>
        </div>

        
      </div>
      <Listed/>
    </main>
  );
}
