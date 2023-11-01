import mongoose from "mongoose";
import { WalletResponseType } from "../js/dataTypes";

const wallet = new mongoose.Schema<WalletResponseType>(
  {
    coin: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", wallet);
export default Wallet;
