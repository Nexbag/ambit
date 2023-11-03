import { Metadata } from "next";
import Carousel from "../components/js/carousel/Carousel";
// import { DarkCoinTicker } from "../components/js/curve/Curve";
import GettingStarted from "../components/js/getting_started/GettingStarted";
import Keys from "../components/js/keys/keys";
import Screen from "../components/js/largescreen/Screen";
import Services from "../components/js/services/Service";

import Speed from "../components/js/speed/speed";
import Listed from "../components/js/listed/listed";
import StcokScreen from "../components/js/largescreen/stock_screen";
export const metadata:Metadata={
  title:"Building the Future of Digital Investments - Amber Trade"
}

export default function Home() {
  return (
    <div>
      <Carousel />
      {/* <DarkCoinTicker /> */}
      <Speed />
      <Services />
      <Keys/>
      <Screen />
      <StcokScreen/>
      <GettingStarted />
      <Listed/>
    </div>
  );
}
