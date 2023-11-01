import mongoose from "mongoose";
import { CryptoWalletResponseType } from "../js/dataTypes";

const cryptoWallet = new mongoose.Schema<CryptoWalletResponseType>(
  {
    coin: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    balance: {
      type: Number,
      default: 0,
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
const CryptoWallet =
  mongoose.models.CryptoWallet || mongoose.model("CryptoWallet", cryptoWallet);
export default CryptoWallet;
