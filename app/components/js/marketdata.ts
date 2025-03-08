import {
  CryptoResponseType,
  DbRawCryptoResponseType,
  DbRawPriceResponseType,
  RawCryptoResponseType,
} from "./dataTypes";
import { marketPriceUrl } from "./config";
import { getRequest } from "./api_client";
import Crypto from "../models/Crypto";
import DbRawCrypto from "../models/RawCrypto";
import DbRawPrice from "../models/RawPrice";

const twomin = 2 * 60 * 1000;
export const getAllMarketPrice = async (): Promise<RawCryptoResponseType[]> => {
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
  const dbPrice = (await DbRawPrice.findOne({
    coin,
    interval: days,
  })) as DbRawPriceResponseType;

  const now = new Date().getTime();

  if (dbPrice && dbPrice.date + twomin > now) {
    return {
      prices: dbPrice.prices,
      market_caps: [[]],
      total_volumes: [[]],
    };
  }

  const { data, success } = await getRequest(
    `${marketPriceUrl}${coin}/market_chart/?vs_currency=usd&days=${days}`
  );

  if (success) {
    const date = new Date().getTime();
    dbPrice
      ? await DbRawPrice.findByIdAndUpdate(dbPrice._id, {
          $set: {
            prices: data.prices,
            date,
          },
        })
      : await DbRawPrice.create({
          prices: data.prices,
          date,
          coin,
          interval: days,
        });

    return data;
  }
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

  const found = await Crypto.findOne({
    $or:
      coin.length > 10
        ? [{ symbol: coin }, { name: coin }, { _id: coin }]
        : [{ symbol: coin }, { name: coin }],
  });
  const foundCoin = found._doc as CryptoResponseType;
  const { data } = await getRequest(`${marketPriceUrl}${foundCoin.ref}`);

  price = foundCoin.currentPrice * data.market_data.current_price.usd;

  return { price, foundCoin };
};
export const getEthPrice = async (): Promise<number> => {
  const { data } = await getRequest(`${marketPriceUrl}ethereum`);

  return data.market_data.current_price.usd;
};

export default getAllMarketPrice;
