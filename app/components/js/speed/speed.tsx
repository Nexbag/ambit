"use client"
import { useSlideUp } from "../useslider";
import styles from "./speed.module.scss";
import Image from "next/image";
export default function Speed() {
  const keys: { title: string; image: string;text:string }[] = [
    {
      title: "Unparalleled Convenience",
      image:"/assets/convenience.jpeg",
      text:"With Amber Trade, convenience is at the forefront of your financial journey. Seamlessly store your digital assets, mine cryptocurrency effortlessly, and invest in the most lucrative projects, all within a single, user-friendly platform. Say goodbye to the hassle of managing multiple accounts – Amber Trade has you covered."
    },
    {
      title: "Empowering Mining Opportunities",
      image:"/assets/mining.jpeg",
      text:"Amber Trade is not just an investment platform; it's a gateway to the world of mining. Unlock the potential of your computing power and start mining crypto with ease. Our intuitive interface and expert guidance ensure that even beginners can delve into the world of crypto mining with confidence."
    },
    {
      title: "Gold Trading",
      image:"/assets/gold.webp",
      text:"At Amber Trade, our expert understanding and global network enable us to facilitate seamless and transparent gold trading experiences, ensuring maximum returns and minimized risks for our clients."
    },
    {
      title: "Stock Exchange",
      image:"/assets/stock.jpeg",
      text:"With meticulous market analysis and personalized portfolio management strategies, Amber Trade empowers investors to navigate the complexities of the stock exchange, fostering sustainable financial growth and long-term value creation."
    },
    {
      title: "Real Estate and Infrastructure",
      image:"/assets/estate.jpeg",
      text:"Through strategic investments and a focus on innovation, Amber Trade contributes to the development of sustainable real estate and infrastructure projects, fostering economic growth and positive societal impact within local and international communities."
    },
    {
      title: "Strategic Investment Opportunities",
      image:"/assets/strategy.jpeg",
      text:"Dive into the world of success with Amber Trade's expertly curated investment opportunities. Our team of seasoned analysts carefully vets every project, ensuring that you have access to only the most promising ventures. From established cryptocurrencies to cutting-edge blockchain projects, real estate, stocks and gold trading, your investment potential knows no bounds."
    },
    {
      title: "Top-Notch Security Measures",
      image:"/assets/security.png",
      text:"Rest assured that your assets are in safe hands with Amber Trade's top-notch security protocols. We understand the importance of safeguarding your investments in the ever-evolving landscape of digital assets. Our robust security measures provide you with peace of mind, allowing you to focus on what truly matters – maximizing your financial growth."
    },
    {
      title: "Personalized Support at Every Step",
      image:"/assets/support.jpeg",
      text:"At Amber Trade, we believe in providing personalized support to every user. Our dedicated team of experts is committed to guiding you through every aspect of your crypto journey, whether you're a seasoned investor or just starting out. Your success is our priority, and we're here to ensure that you achieve your financial goals with confidence."
    },
    {
      title: "Join the Amber Trade Community Today!",
      image:"/assets/shake.avif",
      text:"Experience the future of crypto with Amber Trade. Sign up now and unlock a world of endless possibilities in the realm of digital assets. Embrace the power of convenience, security, and expert guidance – all within one comprehensive platform. Your financial success starts here."
    },
   
  ];
  useSlideUp(["keys"])
  return (
    <div className={styles.main}>
      <div className={styles.top}>
       <h1>Introducing Amber Trade</h1>
       <p>Your All-in-One Solution for Financial Success</p>
      </div>
      <div className={styles.lower} id="keys">
        
        
          {keys.map((e, i) => (
            <div key={i} className={styles.key}>
              <p className={styles.title}>{e.title}</p>
             <div className={styles.images}>
              <Image src={e.image} alt={e.title} fill/>
             </div>
             <p>{e.text}</p>
            </div>
          ))}
        
      </div>
    </div>
  );
}
