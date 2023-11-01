import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";

import Plans from "./Plans";
import { investmentPlanUrl } from "@/app/components/js/config";

const fetchData = async (token: string) => {
  const { data: plans } = await getRequest(
    `${investmentPlanUrl}?all=true`,
    token
  );

  return plans || [];
};

export default async function Page() {
  const token = await handleProtected(true);
  const plans = await fetchData(token);
  return <Plans investmentPlans={plans} />;
}
