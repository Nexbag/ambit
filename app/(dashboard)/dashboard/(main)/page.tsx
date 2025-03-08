import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import {
  investmentUrl,
  referralUrl,
  transactionUrl,
} from "@/app/components/js/config";
import Body from "./body";

const getData = async (token: string) => {
  const { data: transactions, success: good } = await getRequest(
    `${transactionUrl}?small=true`,
    token
  );
  const { data, success } = await getRequest(
    `${investmentUrl}?capitalNotPaid=true`,
    token
  );
  const { data: ref, success: okay } = await getRequest(referralUrl, token);

  return {
    transactions: good ? transactions.transactions : [],
    deposit: good ? transactions.deposit : 0,
    withdrawal: good ? transactions.withdrawal : 0,
    total: good ? transactions.total : 0,
    balance: success ? data.balance.balance : 0,
    pending: success ? data.balance.pending : 0,
    investments: success ? data.investments : [],
    totalRef: okay ? ref.total : 0,
  };
};

export default async function Page(
  props: {
    params: Promise<{}>;
    searchParams: Promise<{ vrcToken: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const token = await handleProtected(false, searchParams.vrcToken);
  const {
    balance,
    investments,
    transactions,
    deposit,
    withdrawal,
    total,
    pending,
    totalRef,
  } = await getData(token);
  return (
    <Body
      balance={balance}
      pending={pending}
      deposit={deposit}
      withdrawal={withdrawal}
      total={total}
      totalRef={totalRef}
      transactions={transactions}
      investments={investments}
    />
  );
}
