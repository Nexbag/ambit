import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";

import { Invest } from "../Investments";
import { redirect } from "next/navigation";
import { investmentPlanUrl } from "@/app/components/js/config";

const fetchData = async (token: string, id: string) => {
  const { data: plan } = await getRequest(`${investmentPlanUrl}${id}`, token);

  if (!plan) redirect("/dashboard/investments");
  return plan;
};

export default async function Page(
  props: {
    searchParams: Promise<{ id: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const token = await handleProtected(false);
  const plan = await fetchData(token, searchParams.id);
  return <Invest plan={plan} />;
}
