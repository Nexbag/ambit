import { ReactNode } from "react";
import Nav from "./nav/Nav";
import Footer from "./footer/Footer";
import Transactions from "../components/js/transaction/Transaction";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Transactions />
      <Footer />
    </>
  );
}
