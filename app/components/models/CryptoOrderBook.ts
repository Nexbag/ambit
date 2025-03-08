import mongoose from "mongoose";
import { CryptoOrderBookResponseType } from "../js/dataTypes";

const cryptoOrderBook = new mongoose.Schema<CryptoOrderBookResponseType>(
  {
    username: {
      type: String,
      required: true,
    },
    baseCoin: {
      type: String,
      required: true,
    },
    newCoin: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    newQty: {
      type: Number,
      required: true,
    },
    baseQty: {
      type: Number,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const CryptoOrderBook =
  mongoose.models.CryptoOrderBook ||
  mongoose.model("CryptoOrderBook", cryptoOrderBook);
export default CryptoOrderBook;
