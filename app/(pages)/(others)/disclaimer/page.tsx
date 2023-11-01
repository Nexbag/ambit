import { COMPANYNAME } from "@/app/components/js/config";
import styles from "../style.module.scss";
export default function Page() {
  const texts: { title: string; text: string }[] = [
    {
      title: "Accuracy of Information",
      text: `The information provided on this website is intended for general informational purposes only. While ${COMPANYNAME} makes every effort to ensure the accuracy, completeness, and timeliness of the information presented, we cannot guarantee that it is entirely free from errors or omissions. The content on this website may be subject to change without prior notice.`,
    },
    {
      title: "Not Financial Advice",
      text: "The information provided on this website, including but not limited to investment plans, returns, and market trends, is for informational purposes only. It should not be considered as financial advice or recommendations to invest. You are encouraged to seek independent financial advice from a qualified professional before making any investment decisions.",
    },
    {
      title: "Investment Risks",
      text: "Investing in cryptocurrencies and related activities involves inherent risks, including but not limited to market volatility, regulatory changes, and potential loss of capital. Past performance is not indicative of future results, and there are no guarantees of profit.",
    },
    {
      title: "Regulatory Compliance",
      text: "Amber Trade operates in accordance with relevant laws and regulations, but the cryptocurrency industry is subject to evolving legal frameworks. It is your responsibility to ensure that you comply with any local, national, or international regulations related to cryptocurrency investments in your jurisdiction.",
    },
    {
      title: "Use of Cookies",
      text: `${COMPANYNAME} may use cookies to enhance your browsing experience on this website. Cookies are small text files that may be stored on your computer or device when you visit our website. We use cookies for various purposes, including analyzing website traffic and providing personalized content. You can manage your cookie preferences by adjusting your browser settings.`,
    },
    {
      title: "Security and Privacy",
      text: "While we take security measures to protect your data and investments, the nature of online services carries inherent risks. Amber Trade is not liable for any loss or damage resulting from unauthorized access, breaches, or data loss.",
    },
    {
      title: "Third-Party Links",
      text: "Our website may contain links to third-party websites or resources. Amber Trade is not responsible for the content, accuracy, or availability of these external sites. Any reliance on third-party content is at your own risk.",
    },
    {
      title: "Intellectual Property Rights",
      text: `All content, including text, images, graphics, logos, and trademarks on this website, is protected by intellectual property laws. You may not reproduce, distribute, or use any content from this website without the prior written consent of ${COMPANYNAME}.`,
    },
    {
      title: "Changes to Disclaimer",
      text: `${COMPANYNAME} reserves the right to modify, amend, or update this disclaimer at any time. Any changes will be effective immediately upon posting on this page. We encourage you to review this disclaimer periodically to stay informed of any updates.`,
    },
  ];
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Disclaimer: {COMPANYNAME}</h1>
        <p>{`Before you explore our website, we want to ensure that you understand and agree to the terms and conditions outlined in this disclaimer. By accessing and using this website, you acknowledge and accept the following terms and conditions:`}</p>
        {texts.map((e, i) => (
          <div key={i}>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
