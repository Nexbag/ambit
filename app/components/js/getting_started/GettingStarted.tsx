import Link from "next/link";
import styles from "./GettingStarted.module.scss";
const GettingStarted: React.FC = (): JSX.Element => {
  const steps: {
    title: string;
    body: string[];
    action: { text: string; link: string };
  }[] = [
    {
      title: "Create and Activate Your Account",
      body: [
        "Begin your journey by signing up for a Amber Trade account. It's a quick and straightforward process.",
        "After registration, check your email for a confirmation link to activate your account.",
        "Your account is now ready for action!",
      ],
      action: {
        text: "Create Account",
        link: "/signup",
      },
    },
    {
      title: "Fund Your Account",
      body: [
        "To start investing, you'll need to add funds to your Amber Trade account. This is the capital you'll put to work.",
        `Navigate to the "Deposit" section and select your preferred payment method.`,
        "Follow the instructions to transfer funds into your Amber Trade account.",
      ],
      action: {
        text: "Fund Account",
        link: "/dashboard/deposit",
      },
    },
    {
      title: "Choose an Investment Plan and Invest",
      body: [
        "Explore our range of investment plans to find one that aligns with your financial goals and risk tolerance.",
        "Once you've chosen a plan, specify the amount you want to invest. This is the money you're committing to the investment.",
        "Confirm your investment, and you're on your way to earning potential returns!",
      ],
      action: {
        text: "See Plans",
        link: "/investments",
      },
    },
    {
      title: "Wait for Your Investment to Mature",
      body: [
        "Your investment will start working for you immediately. Sit back, relax, and let the power of cryptocurrency mining generate returns for you.",
        "Monitor your investment's progress through your Amber Trade account dashboard.",
      ],
      action: {
        text: "More",
        link: "/dashboard/investments/history",
      },
    },
    {
      title: "Withdraw or Reinvest Your ROI (Return on Investment)",
      body: [
        "When your investment matures, you have choices. You can withdraw your ROI to enjoy your earnings, providing financial flexibility.",
        "Alternatively, you can choose to reinvest your ROI to compound your returns and maximize your earning potential.",
        "The choice is yours, and you can easily manage it through your Amber Trade account.",
      ],
      action: {
        text: "Withdraw",
        link: "/dashboard/withdraw",
      },
    },
  ];
  return (
    <div className={styles.main}>
      <h1>Get started in 5 simple steps!</h1>
      <div className={styles.steps}>
        {steps.map((step, i) => (
          <div className={styles.step} key={i}>
            <span>Step {i + 1}</span>
            <h3>{step.title}</h3>
            <ul>
              {step.body.map((l, k) => (
                <li key={k}>{l}</li>
              ))}
            </ul>
            <Link href={step.action.link} className="action2">{step.action.text}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GettingStarted;
