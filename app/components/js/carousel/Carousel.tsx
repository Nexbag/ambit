"use client"

import styles from "./Carousel.module.scss";

import Link from "next/link";
import Cycle from "../effects/cycle";
import useCarousel from "../usecarousel";

const Carousel: React.FC = () => {
  const texts:{title:string;texts:string[]}[]=[
    {
      title:`Trade with Confidence`,
      texts:["Join our global community of investors to invest and trade with confidence in profitable cryptocurrency, forex, stocks, gold, and real estate investments."]
    },
    {
      title:`Global Reach, Local Expertise`,
      texts:["With a presence in over 150 countries, Amber Trade combines global reach with local expertise to provide tailored investment solutions for every market."]
    },
    {
      title:`Institutional Partnerships, Superior Results`,
      texts:["Our trusted partnerships with over 1,000 institutional clients ensure superior investment results and secure financial growth strategies."]
    },
    {
      title:`Proven Results, Tangible Returns`,
      texts:["With over $500M generated in returns for our investors worldwide, Amber Trade consistently delivers proven results and tangible financial gains."]
    },
    {
      title:`Advanced Tools, Smart Investments`,
      texts:["Leveraging advanced technology and tools, Amber Trade empowers investors to make smart and informed investment decisions, maximizing their potential profits."]
    },
    {
      title:`Secure Investments, Trusted Platform`,
      texts:["At Amber Trade, we prioritize security and reliability, ensuring a trusted platform for all your investment needs, backed by industry-leading security measures."]
    },
]

  useCarousel({parentId:"content",indicatorId:"indicator"})
  return (
    <div className={styles.holder}>
      <div className={styles.carousel} id="carousel">
        <div className={styles.effect}>
          <Cycle/>
        </div>
        <div id="box" className={styles.box}>
        <div id="content" className={styles.content}>
   {texts.map((e,i)=>(
         <div className={styles.text} key={i}>
         
         <h1>{e.title}</h1>

        {e.texts.map((c,i)=>(
           <p key={i}
           className={styles.smText}
         >{c}</p>
        ))}

         <div className={styles.links}>
           <Link href="/signup">Create Account</Link>
           <Link href="/about">About Us</Link>
         </div>
       </div>
   ))}
        </div>
        <div id="indicator" className={styles.indicator}>
          {texts.map((e,i)=>(
            <span key={i}></span>
          ))}

        </div>

        </div>
      </div>
    </div>
  );
};

export interface TopperType {

  title: string;
  text: string[];
}
interface TopperProp {
  data: TopperType;
}
export const Topper: React.FC<TopperProp> = ({ data }) => {
  return (
    <div className={`${styles.holder} ${styles.topper}`}>
      <div className={`${styles.carousel} `}>
      <div className={styles.effect}>
          <Cycle/>
        </div>
        

        <div className={styles.box}>
        <div className={styles.content}>
        <div className={styles.text}>
          <h1>{data.title}</h1>

          {data.text.map((e, i) => (
            <p className={styles.smText} key={i}>
              {e}
            </p>
          ))}
        </div>
      </div>
      
          
      
    </div>
    </div>
    
    </div>
  );
};

export default Carousel;
