import styles from "./Payouts.module.scss";

const Payouts: React.FC = () => {
  return (
    <div className={styles.overview}>
      <div className={styles.container}>
        <iframe
          src="https://www.btcwidget.info/widget/liveTx/%23000000/%23000000/%23000000/%23ffffff/%23000000/400/600/10"
          width="400"
          height="600"
        ></iframe>
      </div>
    </div>
  );
};
export default Payouts;
