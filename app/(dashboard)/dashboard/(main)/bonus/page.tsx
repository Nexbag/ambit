import handleProtected from "@/app/components/js/reuseables";

import { getRequest } from "@/app/components/js/api_client";
import { bonusUrl, usersUrl } from "@/app/components/js/config";
import { Body } from "./body";
const fetchData = async (token: string) => {
  const { data } = await getRequest(bonusUrl, token);
  const { data: users } = await getRequest(usersUrl, token);
  return {
    bonuses: data || [],
    users: users || [],
  };
};

export default async function Page() {
  const token = await handleProtected(true);
  const { users, bonuses } = await fetchData(token);
  return <Body bonuses={bonuses} users={users} />;
}
