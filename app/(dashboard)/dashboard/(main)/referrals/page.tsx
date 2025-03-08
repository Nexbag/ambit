import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";
import { getRequest } from "@/app/components/js/api_client";
import { referralUrl } from "@/app/components/js/config";
const getData = async (token: string, username?: string) => {
  const { data, success } = await getRequest(
    username ? `${referralUrl}?username=${username}` : referralUrl,
    token
  );

  return {
    referrals: success ? data.referrals : [],
    transactions: success ? data.transactions : [],
    total: success ? data.total : 0,
  };
};

export default async function Page(
  props: {
    searchParams: Promise<{ username?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const token = await handleProtected(false);
  const { transactions, referrals, total } = await getData(
    token,
    searchParams.username
  );
  return (
    <div>
      <Body transactions={transactions} referrals={referrals} total={total} />
    </div>
  );
}
