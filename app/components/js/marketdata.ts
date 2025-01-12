import {
  CryptoResponseType,
  DbRawCryptoResponseType,
  RawCryptoResponseType,
} from "./dataTypes";
import { marketPriceUrl } from "./config";
import { getRequest } from "./api_client";
import Crypto from "../models/Crypto";
import DbRawCrypto from "../models/RawCrypto";

export const getAllMarketPrice = async (): Promise<RawCryptoResponseType[]> => {
  const twomin = 2 * 60 * 1000;
  function mapper(data: RawCryptoResponseType[]) {
    return data.map((c) => {
      c._id = c.id!;
      return c;
    });
  }
  const res = (await DbRawCrypto.find()) as DbRawCryptoResponseType[];
  const dbRawCrypto = res[0];
  const now = new Date().getTime();

  if (dbRawCrypto && dbRawCrypto.date + twomin > now) {
    return mapper(dbRawCrypto.data);
  }

  const { data, success } = await getRequest(
    `${marketPriceUrl}markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
  );

  if (success) {
    const date = new Date().getTime();
    await DbRawCrypto.findByIdAndUpdate(dbRawCrypto._id, {
      $set: {
        data,
        date,
      },
    });
  }
  const listedCoins = success ? mapper(data) : mapper(dbRawCrypto.data);

  return listedCoins;
};
export const getChartData = async (
  coin: string = "ethereum",
  days: number = 1
): Promise<{
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}> => {
  const { data, success } = await getRequest(
    `${marketPriceUrl}${coin}/market_chart/?vs_currency=usd&days=${days}`
  );

  if (success) return data;
  const { data: ethereum } = await getRequest(
    `${marketPriceUrl}ethereum/market_chart/?vs_currency=usd&days=${days}`
  );
  return ethereum
    ? ethereum
    : {
        prices: [[]],
        market_caps: [[]],
        total_volumes: [[]],
      };
};
export const getCoinPrice = async (coin: string) => {
  let price = 0;

  const foundCoin = (await Crypto.findOne({
    $or: [{ symbol: coin }, { name: coin }, { _id: coin }],
  })) as CryptoResponseType;

  const { data } = await getRequest(`${marketPriceUrl}${foundCoin.ref}`);

  price = foundCoin.currentPrice * data.market_data.current_price.usd;

  return { price, foundCoin };
};
export const getEthPrice = async (): Promise<number> => {
  const { data } = await getRequest(`${marketPriceUrl}ethereum`);

  return data.market_data.current_price.usd;
};

export default getAllMarketPrice;
