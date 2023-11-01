import handleProtected from "@/app/components/js/reuseables";
import { getRequest } from "@/app/components/js/api_client";
import { kycUrl } from "@/app/components/js/config";
import Body from "./body";
const fetchData = async (token: string) => {
  const { data } = await getRequest(kycUrl, token);
  return data || [];
};

export default async function Page() {
  const token = await handleProtected(false);
  const kycs = await fetchData(token);
  return <Body kycs={kycs} />;
}
