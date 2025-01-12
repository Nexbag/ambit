import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { cryptoUrl, cryptoWalletUrl } from "@/app/components/js/config";
import Body from "./body";
const fetchData = async (token: string) => {
  const { data } = await getRequest(cryptoUrl, token);
  const { data: wallets } = await getRequest(cryptoWalletUrl, token);

  return {
    wallets: wallets || [],
    cryptos: data.cryptos || [],
  };
};

export default async function Page() {
  const token = await handleProtected(false);
  const { wallets, cryptos } = await fetchData(token);
  return <Body wallets={wallets} cryptos={cryptos} />;
}
