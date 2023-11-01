import { COMPANYNAME } from "@/app/components/js/config";
import styles from "../style.module.scss";
export default function Page() {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1>Careers: {COMPANYNAME}</h1>

        <div>
          <h3>No vacancy availaible at the moment</h3>
          <p>We are not recruiting at the moment, kindly check back later.</p>
        </div>
      </div>
    </div>
  );
}
