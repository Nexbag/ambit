import mongoose from "mongoose";
import { WalletTranzResponseType } from "../js/dataTypes";

const walletTranz = new mongoose.Schema<WalletTranzResponseType>(
  {
    username: {
      type: String,
      required: true,
    },
    coin: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    qty: {
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
const WalletTranz =
  mongoose.models.WalletTranz || mongoose.model("WalletTranz", walletTranz);
export default WalletTranz;
