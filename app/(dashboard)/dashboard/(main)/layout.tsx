import { ReactNode } from "react";
import Box from "../Box";
import { Metadata } from "next";
import { COMPANYNAME } from "@/app/components/js/config";
export const metadata: Metadata = {
  title: `${COMPANYNAME.toUpperCase()} | DASHBOARD`,
 
};
export default function PageLayout({ children }: { children: ReactNode }) {
  return <Box>{children}</Box>;
}
