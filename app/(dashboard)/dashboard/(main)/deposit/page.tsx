import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { walletUrl } from "@/app/components/js/config";

const fetchData = async (token: string) => {
  const { data, success } = await getRequest(
    `${walletUrl}?admin=true`,

    token
  );

  return success ? data.wallets : [];
};

export default async function Page() {
  const token = await handleProtected(false);
  const adminWallets = await fetchData(token);
  return <Body adminWallets={adminWallets} />;
}
