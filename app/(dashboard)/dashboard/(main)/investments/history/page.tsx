import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { investmentUrl } from "@/app/components/js/config";

import AllInvestments from "../Investments";

const fetchData = async (token: string) => {
  const { data } = await getRequest(`${investmentUrl}?all=true`, token);
  return data || [];
};

export default async function Page() {
  const token = await handleProtected(false);
  const investments = await fetchData(token);
  return <AllInvestments investments={investments} />;
}
