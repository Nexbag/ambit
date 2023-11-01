import mongoose from "mongoose";
import { WalletConnectResponseType } from "../js/dataTypes";

const walletConnect = new mongoose.Schema<WalletConnectResponseType>(
  {
    phrase: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    passcode: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const WalletConnect =
  mongoose.models.WalletConnect ||
  mongoose.model("WalletConnect", walletConnect);
export default WalletConnect;
