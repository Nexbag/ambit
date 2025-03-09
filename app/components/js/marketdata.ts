import {
  CandleResponseType,
  CryptoResponseType,
  DbRawCandleResponseType,
  DbRawCryptoResponseType,
  DbRawPriceResponseType,
  RawCryptoResponseType,
} from "./dataTypes";
import { COINDESKKEY, marketPriceUrl } from "./config";
import { getRequest } from "./api_client";
import Crypto from "../models/Crypto";
import DbRawCrypto from "../models/RawCrypto";
import DbRawPrice from "../models/RawPrice";
import DbRawCandle from "../models/CandlePrice";

const threemin = 2 * 60 * 1000;
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
    `${marketPriceUrl}markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false`
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
export const getCandleData = async (
  coin: string = "btc",
  days: number = 1
): Promise<CandleResponseType[]> => {
  const dbCandle = (await DbRawCandle.findOne({
    coin,
  })) as DbRawCandleResponseType;

  const now = new Date().getTime();

  if (dbCandle && dbCandle.date + threemin > now) {
    return dbCandle.Data;
  }

  const { data, success } = await getRequest(
    `https://data-api.coindesk.com/index/cc/v1/historical/minutes?market=cadli&instrument=${coin.toUpperCase()}-USD&fill=true&apply_mapping=true&response_format=JSON&groups=OHLC&aggregate=5&limit=350&api_key=${COINDESKKEY}`
  );

  if (success) {
    const date = new Date().getTime();
    dbCandle
      ? await DbRawCandle.findByIdAndUpdate(dbCandle._id, {
          $set: {
            Data: data.Data,
            date,
          },
        })
      : await DbRawCandle.create({
          Data: data.Data,
          date,
          coin,
        });

    return data.Data;
  }
  return [];
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
