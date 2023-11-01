import mongoose from "mongoose";
import { TransactionResponseType } from "../js/dataTypes";

const transaction = new mongoose.Schema<TransactionResponseType>(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      enum: [1, 0],
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "/logo.png",
    },
    wallet: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
      enum: [1, 0, -1],
    },
  },
  { timestamps: true }
);
const Transaction =
  mongoose.models.Transaction || mongoose.model("Transaction", transaction);
export default Transaction;
