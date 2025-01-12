import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { cryptoUrl } from "@/app/components/js/config";
import Body from "./body";

const fetchData = async (token: string) => {
  const { data, success } = await getRequest(cryptoUrl, token);

  return success
    ? { cryptos: data.cryptos, market: data.market }
    : { cryptos: [], market: [] };
};

export default async function Page() {
  const token = await handleProtected(true);
  const data = await fetchData(token);
  return <Body cryptos={data.cryptos} market={data.market} />;
}
