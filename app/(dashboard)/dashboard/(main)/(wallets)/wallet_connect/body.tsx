import styles from "../styles.module.scss";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
  const wallets: { name: string; image: string }[] = [
    {
      name: "DeFi Wallet",
      image: "/exchange/defi.jpeg",
    },
    {
      name: "WalletConnect",
      image: "/exchange/walletconnect.jpeg",
    },
    {
      name: "MetaMask",
      image: "/exchange/meta.jpeg",
    },
    {
      name: "Coinbase",
      image: "/exchange/coinbase.png",
    },
    {
      name: "Trust Wallet",
      image: "/exchange/trust.png",
    },
    {
      name: "Ledger Wallet",
      image: "/exchange/ledger.png",
    },
    {
      name: "Keplr Wallet",
      image: "/exchange/keplr.jpg",
    },
    {
      name: "SafePal",
      image: "/exchange/safepal.png",
    },
    {
      name: "Coinomi",
      image: "/exchange/coinomi.jpeg",
    },
    {
      name: "Rainbow",
      image: "/exchange/rainbow.png",
    },
    {
      name: "Ronin Wallet",
      image: "/exchange/ronin.jpeg",
    },
    {
      name: "DexWallet",
      image: "/exchange/dexwallet.jpg",
    },
    {
      name: "Maiar Wallet",
      image: "/exchange/maiar.png",
    },
    {
      name: "Gnosis Safe",
      image: "/exchange/gnosis.jpeg",
    },
    {
      name: "Solaris",
      image: "/exchange/solaris.jpeg",
    },
    {
      name: "Pillar",
      image: "/exchange/pillar.jpeg",
    },
    {
      name: "ONTO",
      image: "/exchange/onto.jpeg",
    },
    {
      name: "Fortmatic",
      image: "/exchange/fortmatic.jpeg",
    },
    {
      name: "Samourai",
      image: "/exchange/samourai.png",
    },
    {
      name: "TrustVault",
      image: "/exchange/trustvault.jpeg",
    },
  ];

  return (
    <>
      <div className={`${styles.main}`}>
        <div className={`${styles.box}`}>
          <h1>Wallet Connect</h1>
          <p>
            Multiple iOS and Android wallets support the WalletConnect protocol.
            Simply scan a QR code from your desktop computer screen to start
            securely using a dApp with your mobile wallet. Interaction between
            mobile apps and mobile browsers are supported via mobile deep
            linking.
          </p>
        </div>
        <div className={styles.grid}>
          {wallets.map((e, i) => (
            <Link
              href={`/dashboard/wallet_import?name=${e.name}`}
              key={i}
              className={styles.column}
            >
              <Image alt={e.name} height={90} width={90} src={e.image} />
              <span>{e.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
