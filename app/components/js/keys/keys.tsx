"use client"
import { COMPANYNAME } from "../config";
import { useSlideUp } from "../useslider";
import styles from "./keys.module.scss";
export default function Keys() {
  const keys: { title: string; text: string }[] = [
    {
      title: `5+ million`,
      text: `Global Users`,
    },
    {
      title: `48,000+`,
      text: `Running Investments`,
    },
    {
      title: `3,800+`,
      text: `Public companies to invest in.`,
    },
    {
      title: `$1.5+ billion`,
      text: `Total process volume per quarter`,
    },
  ];
  useSlideUp(["fig"])
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <span></span>
        <p>{`${COMPANYNAME} key figures`}</p>
      </div>
      <div className={styles.right} id="fig">
        {keys.map((e, i) => (
          <div key={i} className={styles.service}>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
