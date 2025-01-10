import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { cryptoUrl } from "@/app/components/js/config";
import Body from "./body";
import getAllMarketPrice from "@/app/components/js/marketdata";
const fetchData = async (token: string) => {
  const { data } = await getRequest(cryptoUrl, token);
  const market = await getAllMarketPrice();
  return { cryptos: data, market };
};

export default async function Page() {
  const token = await handleProtected(true);
  const data = await fetchData(token);
  return <Body cryptos={data.cryptos} market={data.market} />;
}
