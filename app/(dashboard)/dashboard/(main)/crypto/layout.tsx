import CoinPriceTicker from "@/app/components/js/curve/Curve";
import styles from "./styles.module.scss";
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <CoinPriceTicker />

      {children}
    </div>
  );
}
