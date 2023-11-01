import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";

import GettingStarted from "@/app/components/js/getting_started/GettingStarted";

export default async function Page() {
  const data: TopperType = {
    title: "Join Us on Your Investment Journey",
    text: [
      "Amber Trade is a leading cryptocurrency investment platform that specializes in cryptocurrency mining. With a rich history dating back to 2010, we have consistently delivered exceptional results to our clients, empowering them to navigate the dynamic world of digital currencies with confidence.",
      "This overview will introduce you to our platform, and how you can get started on your journey to financial growth.",
    ],
   
  };

  return (
    <main>
      <Topper data={data} />

      <GettingStarted />
    </main>
  );
}
