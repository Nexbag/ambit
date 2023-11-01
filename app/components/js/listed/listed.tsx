import Image from "next/image";
import styles from "./listed.module.scss";
export default function Listed() {
const images:string[]=[
  "/listed/fortune.svg",
  "/listed/techcrunch.svg",
  "/listed/bloomberg.svg",
  "/listed/forbes.svg",
]

  return (
    <div className={styles.main}>
      <span className={styles.seen}>As Seen In</span>
      
      <div className={styles.right} id="fig">
        {images.map((e, i) => (
          <div key={i} className={styles.image}>
            <Image src={e} fill alt=""/>
          </div>
        ))}
      </div>
    </div>
  );
}
