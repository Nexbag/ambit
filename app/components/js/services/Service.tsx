import Image from "next/image";
import styles from "./Service.module.scss";
import Link from "next/link";
export default function Services() {
 
  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <div className={styles.display}>
          <div className={styles.img}>
            <Image src={"/assets/glow.gif"} alt="" sizes="200" fill />
          </div>
        </div>
        <div className={styles.text}>
        <h2>Ready to Join Us?</h2>
        <p>{`Ready to unlock the potential of your finances? Join Amber Trade today and take the first step towards a brighter financial future. With our user-friendly platform and expert guidance, you'll have the tools you need to explore the most lucrative investment opportunities. Don't miss out on this chance to secure your financial success.`}</p>
        <Link href={"/signup"} className="action">Join Amber</Link>
        </div>
      </div>
     
    </div>
  );
}
