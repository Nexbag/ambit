import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import Payouts from "./payouts";

export default function WithdrawalPage() {
  const data: TopperType = {
    text: ["Our clients are getting paid 24/7"],
    title: "Recent withdrawals",
    
  };
  return (
    <div>
      <Topper data={data} />
      <Payouts />
    </div>
  );
}
