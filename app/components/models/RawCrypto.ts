import mongoose from "mongoose";
import {
  DbRawCryptoResponseType,
  RawCryptoResponseType,
} from "../js/dataTypes";
const rawCryptoSchema = new mongoose.Schema<RawCryptoResponseType>(
  {
    current_price: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
const dbRawCrypto = new mongoose.Schema<DbRawCryptoResponseType>(
  {
    data: {
      type: [rawCryptoSchema],
      required: true,
    },

    date: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const DbRawCrypto =
  mongoose.models.DbRawCrypto || mongoose.model("DbRawCrypto", dbRawCrypto);
export default DbRawCrypto;
