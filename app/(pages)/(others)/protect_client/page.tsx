import React from "react";

import styles from "../style.module.scss";
import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import { COMPANYNAME } from "@/app/components/js/config";

const Terms: React.FC = () => {
  const topperData: TopperType = {
    title: "Protecting our clients",

    text: [
      `At ${COMPANYNAME}, the safety and security of our clients is our top
          priority. We understand that our clients trust us with their
          investments and personal information, and we take this responsibility
          seriously.`,
    ],
  };
  const texts: { title: string; text: string }[] = [
    {
      title: "Advanced Security Protocols:",
      text: "We utilize the latest security protocols to protect our clients' data and investments. Our website is encrypted using SSL technology to ensure that all information transmitted between our servers and clients' devices is secure.",
    },
    {
      title: "Secure Data Storage:",
      text: "We store all client data in secure, off-site servers that are protected by advanced security protocols. Our servers are located in secure data centers, and we have implemented multiple layers of security to prevent unauthorized access to our clients' information.",
    },
    {
      title: "Compliance with Regulatory Standards:",
      text: "We are fully compliant with all relevant regulatory standards, including Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations. We conduct thorough background checks on all clients to ensure that our platform is not used for any illegal activities.",
    },
    {
      title: "Experienced Security Team:",
      text: "Our security team comprises experienced professionals who specialize in cybersecurity and risk management. They are responsible for monitoring our platform and implementing new security measures to protect our clients' assets and information.",
    },
    {
      title: "Transparency:",
      text: "We believe in transparency, and we are committed to keeping our clients informed about our security measures and protocols. We regularly update our clients on any changes to our security measures or any potential risks to their investments.",
    },
  ];
  return (
    <div>
      <Topper data={topperData} />

      <section className={styles.main}>
        <div className={styles.container}>
          <h2>
            {`We have implemented a range of measures to protect our clients' assets and information, including:`}
          </h2>
          {texts.map((text, i) => (
            <div key={i}>
              <h3>
                {`${i + 1}. `}
                {text.title}
              </h3>
              <p>{text.text}</p>
            </div>
          ))}
          <p>{`At ${COMPANYNAME}, we understand that security is crucial in the cryptocurrency industry. That is why we have invested heavily in advanced security measures and protocols to protect our clients' assets and information. Our clients can be confident that their investments are safe and secure with us.`}</p>
        </div>
      </section>
    </div>
  );
};
export default Terms;
