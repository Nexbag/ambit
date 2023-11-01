import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { investmentUrl } from "@/app/components/js/config";
import { redirect } from "next/navigation";
import { ViewInvestment } from "../Investments";
const fetchData = async (token: string, id: string) => {
  const { data } = await getRequest(`${investmentUrl}${id}`, token);

  if (!data) {
    redirect("/dashboard/investments/history");
  }

  return { plan: data.plan, investment: data.investment };
};

export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(false);
  const { plan, investment } = await fetchData(token, params.id);
  return <ViewInvestment investment={investment} plan={plan} />;
}
