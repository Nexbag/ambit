import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { cryptoWalletUrl } from "@/app/components/js/config";
import Body from "./body";
import { redirect } from "next/navigation";

const fetchData = async (token: string, id: string) => {
  const { data } = await getRequest(`${cryptoWalletUrl}${id}`, token);
  if (!data) redirect("/dashboard/crypto");
  return data;
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const token = await handleProtected();
  const data = await fetchData(token, params.id);

  return (
    <Body wallet={data.wallet} crypto={data.crypto} prices={data.prices} />
  );
}
