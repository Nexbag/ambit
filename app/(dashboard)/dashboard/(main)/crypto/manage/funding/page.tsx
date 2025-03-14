import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { cryptoTransactionUrl } from "@/app/components/js/config";
import Body from "./body";
const fetchData = async (token: string) => {
  const { data } = await getRequest(cryptoTransactionUrl, token);

  return data || [];
};

export default async function Page() {
  const token = await handleProtected(true);
  const data = await fetchData(token);
  return <Body transactions={data} />;
}
