import handleProtected from "@/app/components/js/reuseables";
import { UpdateMember } from "../body";
import { investmentUrl, usersUrl } from "@/app/components/js/config";
import { getRequest } from "@/app/components/js/api_client";
import { redirect } from "next/navigation";
const fetchData = async (token: string, id: string) => {
  const { data: uzer } = await getRequest(`${usersUrl}${id}`, token);

  const { data } = await getRequest(
    `${investmentUrl}?balance=${uzer?.username}`,
    token
  );

  if (!uzer || !data) redirect("/dashboard/users");
  return { uzer, pending: data.pending, balance: data.balance };
};
export default async function Page({ params }: { params: { id: string } }) {
  const token = await handleProtected(true);
  const { uzer, pending, balance } = await fetchData(token, params.id);
  return (
    <UpdateMember foundUser={uzer} balance={balance} systemBalance={pending} />
  );
}
