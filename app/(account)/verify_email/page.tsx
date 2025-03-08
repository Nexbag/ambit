import { handleVerify } from "@/app/components/js/reuseables";
import Link from "next/link";

export default async function Verify(
  props: {
    params: Promise<{}>;
    searchParams: Promise<{ vot: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const { success, data } = await handleVerify(searchParams.vot);

  return (
    <div>
      <h1>{success ? "Verified" : "Expired Link"}</h1>
      {success && <p>Thank you for verifying {data.email}</p>}
      <Link href={"/dashboard"}>Go to Dashboard</Link>
    </div>
  );
}
