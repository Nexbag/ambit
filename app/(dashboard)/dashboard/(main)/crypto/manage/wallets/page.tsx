import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { cryptoUrl, cryptoWalletUrl } from "@/app/components/js/config";
import Body from "./body";

const fetchData = async (token: string) => {
  const { data: wallets } = await getRequest(
    `${cryptoWalletUrl}?all=true`,
    token
  );
  const { data } = await getRequest(cryptoUrl, token);
  return {
    wallets: wallets || [],
    cryptos: data.cryptos || [],
  };
};

export default async function Page() {
  const token = await handleProtected(true);
  const data = await fetchData(token);
  return <Body wallets={data.wallets} cryptos={data.cryptos} />;
}
