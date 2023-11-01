import handleProtected from "@/app/components/js/reuseables";
import Body from "./body";

export default async function Page() {
  await handleProtected(false);
  return <Body />;
}
