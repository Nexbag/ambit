import connection from "@/app/components/js/connection";
import { CryptoWalletResponseType } from "@/app/components/js/dataTypes";
import getAllMarketPrice from "@/app/components/js/marketdata";
import verifyToken, { makeWalletAddress } from "@/app/components/js/token";
import Crypto from "@/app/components/models/Crypto";
import CryptoWallet from "@/app/components/models/CryptoWallet";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);

    const cryptocurrencys = await Crypto.find().sort({ _id: -1 });
    const cryptos = cryptocurrencys.map((crypto: { _doc: any }) => crypto._doc);

    const wallets = tokenUser.admin
      ? ((await CryptoWallet.find({
          adminWallet: true,
        })) as CryptoWalletResponseType[])
      : ((await CryptoWallet.find({
          username: tokenUser.username,
        })) as CryptoWalletResponseType[]);

    if (wallets.length < cryptos.length) {
      const newCustomWallets = cryptos.filter((coin) => {
        const addWallet = wallets.find((wall) => wall.coin == coin.symbol);
        if (!addWallet) return coin;
      });
      const walletsToAdd = newCustomWallets.map((coin) => {
        return {
          coin: coin.symbol,
          address: makeWalletAddress(coin.name),
          username: tokenUser.username,
          balance: 0,
          adminWallet: tokenUser.admin,
        };
      });

      const addedWallets = await CryptoWallet.create(walletsToAdd);

      wallets.push(...addedWallets);
    }
    if (
      (!wallets[0].admin || !wallets[wallets.length - 1].admin) &&
      tokenUser.admin &&
      tokenUser.username == wallets[0].username
    )
      await CryptoWallet.updateMany(
        { username: tokenUser.username },
        { $set: { adminWallet: true } }
      );
    const market = await getAllMarketPrice();

    const cryptoAndWallet: CryptoWalletResponseType[] = cryptos.map(
      (crypto: CryptoWalletResponseType) => {
        const found = wallets.find((wallet) => wallet.coin == crypto.symbol)!;

        const raw = market.find((e) => e.id == crypto.ref);

        const price = raw?.current_price || raw?.currentPrice || 0;

        crypto.address = found.address;
        crypto.balance = found.balance;
        crypto.username = found.username;
        crypto.currentPrice = crypto.currentPrice * price;

        return crypto;
      }
    );
    cryptoAndWallet.sort(
      (a, b) => b.balance * b.currentPrice - a.balance * a.currentPrice
    );

    return new NextResponse(JSON.stringify(cryptoAndWallet), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Some error occured" }), {
      status: 401,
    });
  }
}
export async function PUT(req: Request) {
  try {
    await connection();
    const tokenUser = verifyToken(`${req.headers.get("token")}`);
    const body = await req.json();
    const { receiverWalletAddress, senderWalletAddress, amount } = body;
    const sender = (await CryptoWallet.findOneAndUpdate(
      {
        address: senderWalletAddress,
        username: tokenUser.username,
        balance: { $gte: amount },
      },
      { $inc: { balance: amount * -1 } },
      { new: true }
    )) as CryptoWalletResponseType;
    if (!sender)
      return new NextResponse(
        JSON.stringify({ message: "Insufficient funds" }),
        { status: 402 }
      );
    const receiver = await CryptoWallet.findOneAndUpdate(
      {
        address: receiverWalletAddress,
        coin: sender.coin,
      },
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!receiver) {
      await CryptoWallet.findByIdAndUpdate(
        sender._id,
        { $inc: { balance: amount } },
        { new: true }
      );
      return new NextResponse(
        JSON.stringify({ message: "Invalid wallet address" }),
        { status: 401 }
      );
    }

    return new NextResponse(JSON.stringify({ sender, receiver }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ message: "Some error occured" }), {
      status: 401,
    });
  }
}
