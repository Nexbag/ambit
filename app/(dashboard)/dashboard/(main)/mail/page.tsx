import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { transactionUrl, usersUrl } from "@/app/components/js/config";
const getData = async (token: string) => {
  const { data: transactions } = await getRequest(
    `${transactionUrl}?type=1&status=1`,
    token
  );
  const { data: users } = await getRequest(usersUrl, token);

  return {
    transactions: transactions || [],
    users: users || [],
  };
};

export default async function Page() {
  const token = await handleProtected(true);
  const { transactions, users } = await getData(token);
  return <Body transactions={transactions} users={users} />;
}
