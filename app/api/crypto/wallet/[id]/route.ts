import connection from "@/app/components/js/connection";
import {
  CryptoResponseType,
  CryptoWalletResponseType,
} from "@/app/components/js/dataTypes";
import getAllMarketPrice, {
  getChartData,
  getCoinPrice,
} from "@/app/components/js/marketdata";
import verifyToken from "@/app/components/js/token";
import Crypto from "@/app/components/models/Crypto";

import CryptoOrderBook from "@/app/components/models/CryptoOrderBook";
import CryptoWallet from "@/app/components/models/CryptoWallet";
import User from "@/app/components/models/User";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    const wall = tokenUser.admin
      ? await CryptoWallet.findById(params.id)
      : await CryptoWallet.findOne({
          _id: params.id,
          username: tokenUser.username,
        });
    const wallet = wall._doc;
    const market = await getAllMarketPrice();
    const found = await Crypto.findOne({
      symbol: wallet.coin,
    });
    const foundCoin = found._doc as CryptoResponseType;
    const marketCoin = market.find((e) => e.id == foundCoin.ref)!;
    const walletRes: CryptoWalletResponseType = {
      ...foundCoin,
      address: wallet.address,
      balance: wallet.balance,
      username: wallet.username,
      currentPrice: marketCoin.current_price * foundCoin.currentPrice,
      coin: wallet.coin,
      admin: wallet.admin,
      _id: wall._id,
    };

    const chart = await getChartData(foundCoin.ref, 91);
    const prices = chart.prices.map((price) => {
      price[1] = price[1] * foundCoin.currentPrice;
      return price;
    });

    return new NextResponse(
      JSON.stringify({ wallet: walletRes, prices, crypto: foundCoin }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    const body = await req.json();
    const { qty, move, newCoin, type } = body;

    if (tokenUser.admin) {
      if (qty && !(move || newCoin)) {
        await CryptoWallet.findByIdAndUpdate(params.id, {
          $inc: {
            balance: qty,
          },
        });
        return new NextResponse(JSON.stringify({ message: "Success" }), {
          status: 200,
        });
      }
      const wall = (await CryptoWallet.findById(
        params.id
      )) as CryptoWalletResponseType;
      const data = await getCoinPrice(wall.coin);
      const amount = qty * data.price;
      if (move) {
        const wallet = (await CryptoWallet.findOneAndUpdate(
          {
            _id: params.id,
            balance: { $gte: qty },
          },
          { $inc: { balance: qty * -1 } },
          { new: true }
        )) as CryptoWalletResponseType;
        if (!wallet)
          return new NextResponse(
            JSON.stringify({ message: "Insufficient funds" }),
            {
              status: 402,
            }
          );
        await User.findOneAndUpdate(
          { username: wallet.username },
          { $inc: { balance: amount } },
          { new: true }
        );
      }
      if (newCoin) {
        const newCoinData = await getCoinPrice(newCoin);
        const newQty = amount / newCoinData.price;

        const wallet = (await CryptoWallet.findOneAndUpdate(
          {
            _id: params.id,
            balance: { $gte: qty },
          },
          { $inc: { balance: qty * -1 } },
          { new: true }
        )) as CryptoWalletResponseType;

        if (!wallet)
          return new NextResponse(
            JSON.stringify({ message: "Insufficient funds" }),
            {
              status: 402,
            }
          );
        await CryptoWallet.findOneAndUpdate(
          {
            username: wallet.username,
            coin: newCoinData.foundCoin.symbol,
          },
          { $inc: { balance: newQty } },
          { new: true }
        );
      }
      return new NextResponse(JSON.stringify({ message: "Success" }), {
        status: 200,
      });
    }
    const wall = (await CryptoWallet.findById(
      params.id
    )) as CryptoWalletResponseType;
    const data = await getCoinPrice(wall.coin);
    const amount = qty * data.price;
    if (newCoin) {
      const newCoinData = await getCoinPrice(newCoin);
      const newQty = amount / newCoinData.price;
      const wallet = (await CryptoWallet.findOneAndUpdate(
        {
          _id: params.id,
          balance: { $gte: qty },
          username: tokenUser.username,
        },
        { $inc: { balance: qty * -1 } },
        { new: true }
      )) as CryptoWalletResponseType;
      if (!wallet)
        return new NextResponse(
          JSON.stringify({ message: "Insufficient funds" }),
          {
            status: 402,
          }
        );
      await CryptoWallet.findOneAndUpdate(
        {
          username: wallet.username,
          coin: newCoinData.foundCoin.symbol,
        },
        { $inc: { balance: newQty } },
        { new: true }
      );
      const date = new Date().getTime();
      await CryptoOrderBook.create({
        username: tokenUser.username,
        baseCoin: data.foundCoin.symbol,
        newCoin: newCoinData.foundCoin.symbol,
        basePrice: data.price,
        newPrice: newCoinData.price,
        newQty,
        baseQty: qty,
        date,
      });
    }

    if (type == 1) {
      const wallet = (await CryptoWallet.findOneAndUpdate(
        {
          coin: "usdt",
          balance: { $gte: amount },
          username: tokenUser.username,
        },
        { $inc: { balance: amount * -1 } },
        { new: true }
      )) as CryptoWalletResponseType;
      if (!wallet)
        return new NextResponse(
          JSON.stringify({ message: "Insufficient funds" }),
          {
            status: 402,
          }
        );
      await CryptoWallet.findOneAndUpdate(
        {
          username: wallet.username,
          coin: wall.coin,
        },
        { $inc: { balance: qty } },
        { new: true }
      );
      const date = new Date().getTime();
      await CryptoOrderBook.create({
        username: tokenUser.username,
        baseCoin: "usdt",
        newCoin: wall.coin,
        basePrice: 1,
        newPrice: data.price,
        newQty: qty,
        baseQty: amount,
        date,
      });
    }
    if (type == 0) {
      const wallet = (await CryptoWallet.findOneAndUpdate(
        {
          _id: params.id,
          balance: { $gte: qty },
          username: tokenUser.username,
        },
        { $inc: { balance: qty * -1 } },
        { new: true }
      )) as CryptoWalletResponseType;
      if (!wallet)
        return new NextResponse(
          JSON.stringify({ message: "Insufficient funds" }),
          {
            status: 402,
          }
        );
      await CryptoWallet.findOneAndUpdate(
        {
          username: wallet.username,
          coin: "usdt",
        },
        { $inc: { balance: amount } },
        { new: true }
      );
      const date = new Date().getTime();
      await CryptoOrderBook.create({
        username: tokenUser.username,
        baseCoin: wall.coin,
        newCoin: "usdt",
        basePrice: data.price,
        newPrice: 1,
        newQty: amount,
        baseQty: qty,
        date,
      });
    }

    return new NextResponse(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
