import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { transactionUrl } from "@/app/components/js/config";
const getData = async (token: string) => {
  const { data: transactions } = await getRequest(
    `${transactionUrl}?transfer=true`,
    token
  );

  return {
    transactions: transactions || [],
  };
};

export default async function Page() {
  const token = await handleProtected(false);
  const { transactions } = await getData(token);
  return <Body transactionz={transactions} />;
}
