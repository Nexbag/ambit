import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";
import Calculator from "./Calculator";
import { getRequest } from "@/app/components/js/api_client";
import { investmentPlanUrl } from "@/app/components/js/config";
const fetchData = async () => {
  try {
    const data = await getRequest(investmentPlanUrl);
    return data ? data.data || [] : [];
  } catch (error) {
    return [];
  }
};
export const revalidate = 60;
export default async function Page() {
  const plans = await fetchData();
  const data: TopperType = {
    text: ["Calculate your investment returns here"],
    title: "Plan Calculator",
  };
  return (
    <div>
      <Topper data={data} />
      <Calculator plans={plans} />
    </div>
  );
}
