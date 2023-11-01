import handleProtected from "@/app/components/js/reuseables";
import { UpdatePlan } from "../Plans";
import { getRequest } from "@/app/components/js/api_client";
import { investmentPlanUrl } from "@/app/components/js/config";
import { redirect } from "next/navigation";

const fetchData = async (token: string, id: string) => {
  const { data: plan } = await getRequest(`${investmentPlanUrl}${id}`, token);
  if (!plan) redirect("/dashboard/investments/plans");
  return plan;
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(true);
  const plan = await fetchData(token, params.id);
  return <UpdatePlan plan={plan} />;
}
