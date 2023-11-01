import { COMPANYNAME, EMAIL } from "@/app/components/js/config";
import styles from "../style.module.scss";
export default function Page() {
  const texts: { title: string; text: string[] }[] = [
    {
      title: "Information We Collect",
      text: [
        "We collect various types of information when you interact with our website and use our banking services, including:",
        "Personal Information: We may collect personal information that you provide to us when you register for an account, make an investment, or use our services. This may include your name, email address, contact information, and other relevant details.",
        "Financial Information: To process investments and transactions, we may collect financial information such as wallet address. This information is securely stored and used only for transactional purposes.",
        "Usage Data: We automatically collect information about your use of our website and services, including IP addresses, device information, browser type, and usage patterns. This data helps us improve our services and tailor your user experience.",
      ],
    },
    {
      title: "How We Use Your Information",
      text: [
        "Service Provision: We use your personal information to provide you with access to our services, process transactions, and manage your account.",
        "Communication: We may use your contact information to communicate with you about your investments, updates to our services, and other relevant information.",
        "Analytics: We use usage data to analyze website traffic, monitor the performance of our services, and improve user experience.",
      ],
    },
    {
      title: "Disclosure of Your Information",
      text: [
        "Third-Party Service Providers: We may share your personal information with third-party service providers who assist us in providing our services, including payment processors, security providers, and customer support services.",
        "Legal Compliance: We may disclose your information when required by law, regulatory authorities, or in response to legal requests.",
      ],
    },
    {
      title: "Data Security",
      text: [
        "We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. We regularly review and update our security practices to maintain the confidentiality and integrity of your data.",
      ],
    },
    {
      title: "Your Choices",
      text: [
        "You have the right to access, correct, or delete your personal information. You may also opt out of receiving promotional communications from us. Please contact us at support@Amber Trade.com to exercise these rights or if you have any privacy-related concerns.",
      ],
    },
    {
      title: "Changes to This Privacy Policy",
      text: [
        "We may update this Privacy Policy to reflect changes in our data practices or legal requirements. The revised policy will be posted on our website with the date of the latest update. We encourage you to review the policy periodically.",
      ],
    },
  ];
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Privacy Policy of {COMPANYNAME}</h1>
        <h2>Last Updated: August 2021</h2>
        <div>
          <p>{`Amber Trade ("we," "our," or "the Company") is committed to protecting the privacy of our users. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you access or use our website and services.`}</p>
        </div>
        {texts.map((e, i) => (
          <div key={i}>
            <h3>{e.title}</h3>
            {e.text.map((k, j) => (
              <p key={j}>{k}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
