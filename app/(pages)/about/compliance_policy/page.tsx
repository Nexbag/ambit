import { COMPANYNAME } from "@/app/components/js/config";
import styles from "../styles.module.scss";

const Sustainability = () => {
  const texts: { title: string; text: string }[] = [
    {
      title: "Regulatory Compliance",
      text: "Our compliance policy is built on the foundation of adhering to all relevant laws, regulations, and industry standards. We keep a keen eye on the evolving regulatory landscape, ensuring that our practices are always up to date.",
    },
    {
      title: "Data Protection and Privacy",
      text: `${COMPANYNAME} recognizes the importance of safeguarding the personal and financial information of our customers. We have robust data protection measures in place to comply with data privacy laws and regulations, ensuring that customer information is kept secure and confidential.`,
    },
    {
      title: "Anti-Money Laundering (AML) and Know Your Customer (KYC)",
      text: "We are committed to preventing financial crime and ensuring that our services are not misused for illicit purposes. Our AML and KYC policies are designed to detect and report suspicious activities while verifying the identity of our customers.",
    },
    {
      title: "Risk Management",
      text: `${COMPANYNAME} actively manages and assesses risks to protect the interests of our customers and stakeholders. We have rigorous risk assessment and mitigation procedures in place to ensure the safety and stability of our operations.`,
    },
    {
      title: "Ethical Conduct",
      text: `${COMPANYNAME}'s culture revolves around ethical behavior and integrity. We encourage our employees to maintain the highest ethical standards in all their interactions, both internally and with our customers.`,
    },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div>
          <h1>Upholding Trust and Integrity</h1>
          <p>
            {`In an era of rapid technological advancement and innovation in the cryptocurrency sector, ${COMPANYNAME} stands as a beacon of reliability, transparency, and customer-centricity. We have made it our mission to redefine the cryptocurrency mining sector by leveraging cutting-edge technology. However, at the heart of all our endeavors lies an unwavering commitment to compliance and ethical conduct.`}
          </p>
        </div>
        <div>
          <h1>Our Regulatory Journey</h1>
          <p>{`${COMPANYNAME} received its authorisation license in 2018, marking the beginning of our journey to reshape the cryptocurrency landscape. Since then, our commitment to regulatory compliance and adherence to industry standards have not only been steadfast but have also earned us several licenses and prestigious awards. These accolades are a testament to our dedication to providing secure and innovative financial services while maintaining the highest standards of integrity.`}</p>
        </div>
        <div>
          <h2>{`The Pillars of ${COMPANYNAME}'s Compliance Policy`}</h2>
          {texts.map((text, i) => (
            <div key={i}>
              <h2>{text.title}</h2>
              <p>{text.text}</p>
            </div>
          ))}
        </div>
        <div>
          <h2>Our Ongoing Commitment</h2>
          <p>{`Our compliance policy is not just a set of rules and regulations; it is a way of doing business. It's about upholding trust and integrity in every action we take. ${COMPANYNAME} will continue to invest in resources, technology, and training to ensure that we not only meet but exceed the expectations of regulatory bodies and, more importantly, our customers.`}</p>
          <p>{`As we pursue our mission to redefine mining through technology, our compliance policy remains a non-negotiable aspect of our operations. We believe that by adhering to these principles, we can build a financial institution that not only innovates but also protects, serves, and empowers our customers. ${COMPANYNAME} is not just a mining platform; it's a trusted partner on your financial journey.`}</p>
          <p>{`Thank you for choosing ${COMPANYNAME}, where trust and integrity are our guiding principles.`}</p>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
