import handleProtected from "@/app/components/js/reuseables";
import { PlanList } from "./Investments";
import { getRequest } from "@/app/components/js/api_client";
import { investmentPlanUrl } from "@/app/components/js/config";
const fetchData = async (token: string) => {
  const { data } = await getRequest(investmentPlanUrl, token);
  return data || [];
};

export default async function Page() {
  const token = await handleProtected(false);
  const plans = await fetchData(token);
  return <PlanList plans={plans} />;
}
