import Link from "next/link";
import Footer from "./(pages)/footer/Footer";
import Nav from "./(pages)/nav/Nav";
import styles from "./lost.module.scss";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <div>
      <Suspense>
        <Nav />
      </Suspense>
      <div className={styles.main}>
        <h1>This link is no longer available</h1>
        <Link href={"/"} className="action">
          Back Home
        </Link>
      </div>
      <Footer />
    </div>
  );
}
