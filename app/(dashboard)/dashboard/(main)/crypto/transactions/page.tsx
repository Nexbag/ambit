import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import {
  cryptoOrderBookUrl,
  cryptoTransactionUrl,
} from "@/app/components/js/config";
import Body from "./body";
const fetchData = async (token: string) => {
  const { data } = await getRequest(cryptoOrderBookUrl, token);
  const { data: history } = await getRequest(cryptoTransactionUrl, token);

  return {
    orders: data || [],
    history: history || [],
  };
};

export default async function Page() {
  const token = await handleProtected(false);
  const { orders, history } = await fetchData(token);
  return <Body orders={orders} history={history} />;
}
