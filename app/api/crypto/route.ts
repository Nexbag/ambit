import connection from "@/app/components/js/connection";
import { CryptoResponseType } from "@/app/components/js/dataTypes";
import getAllMarketPrice, {
  getChartData,
} from "@/app/components/js/marketdata";
import verifyToken from "@/app/components/js/token";
import Crypto from "@/app/components/models/Crypto";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connection();
    const url = new URL(req.url);
    const coinName = url.searchParams.get("coinName");
    if (!coinName) {
      const cryptos = await Crypto.find();
      const market = await getAllMarketPrice();
      return new NextResponse(JSON.stringify({ cryptos, market }), {
        status: 200,
      });
    }
    const days = url.searchParams.get("days");
    const crypto = (await Crypto.findOne({
      $or: [{ symbol: coinName }, { name: coinName }],
    })) as CryptoResponseType;
    const chart = await getChartData(
      crypto ? crypto.ref : coinName,
      parseInt(`${days || 1}`)
    );
    let coinDetails: CryptoResponseType | null = null;
    if (!crypto) {
      const coins = await getAllMarketPrice();
      coinDetails = coins.find(
        (c) =>
          c.id == coinName ||
          c._id == coinName ||
          c.symbol == coinName ||
          c.name == coinName
      )!;
    } else {
      const prices = chart.prices.map((price) => {
        price[1] = price[1] * crypto.currentPrice;
        return price;
      });
      chart.prices = prices;
    }

    return new NextResponse(
      JSON.stringify({ data: crypto ? crypto : coinDetails, chart }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Some Error Occured" }), {
      status: 401,
    });
  }
}
export async function POST(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    if (!tokenUser.admin) throw new Error();
    const body = await req.json();
    body.symbol = body.symbol.toLowerCase();
    const cryptos = await Crypto.create(body);

    return new NextResponse(JSON.stringify(cryptos), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
