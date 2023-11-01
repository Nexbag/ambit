import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { postRequest, putRequest } from "./api_client";
import { tokenUrl, usersUrl } from "./config";

const handleProtected = async (admin: boolean = false, vot?: string) => {
  const nextCookies = cookies();

  const token = nextCookies.get("token")?.value;

  if (!token) redirect("/login");
  const { data, success } = await postRequest(tokenUrl, { token }, token);

  if (!success) redirect("/login");
  if (!data.verified && vot) {
    redirect(`/verify_email?vot=${vot}`);
  }
  if (admin && !data.admin) {
    redirect("/dashboard");
  }
  return token;
};
export const handleVerify = async (vot?: string) => {
  const nextCookies = cookies();

  const token = nextCookies.get("token")?.value;

  if (!token) redirect("/login");
  const { data, success } = await putRequest(
    usersUrl,
    { verifyEmail: true },
    vot
  );

  if (!success) redirect("/login");
  return { data, success };
};

export const handleAuthorization = async () => {
  const nextCookies = cookies();

  const token = nextCookies.get("token")?.value;

  if (!token) return;
  const { success } = await postRequest(tokenUrl, { token }, token);
  if (success) redirect("/dashboard");
};

export default handleProtected;
