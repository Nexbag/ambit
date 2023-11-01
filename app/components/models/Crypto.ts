import mongoose from "mongoose";
import { CryptoResponseType } from "../js/dataTypes";

const crypto = new mongoose.Schema<CryptoResponseType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Crypto = mongoose.models.Crypto || mongoose.model("Crypto", crypto);
export default Crypto;
