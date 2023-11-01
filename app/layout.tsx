import Wrap from "./components/js/Wrapper";
import { COMPANYNAME } from "./components/js/config";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: COMPANYNAME,
  description: `${COMPANYNAME} is your number one choice for profitable cryptocurrency investments.`,
  icons: [{ rel: "icon", url: "/favicon.ico" },],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Wrap>{children}</Wrap>
      </body>
    </html>
  );
}
