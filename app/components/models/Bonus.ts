import mongoose from "mongoose";
import { BonusResponseType } from "../js/dataTypes";

const bonus = new mongoose.Schema<BonusResponseType>(
  {
    amount: {
      type: Number,
      required: true,
    },
    redeemAmount: {
      type: Number,
      required: true,
    },
    status: {
      enum: [0, 1, -1],
      type: Number,
      default: 0,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Bonus = mongoose.models.Bonus || mongoose.model("Bonus", bonus);
export default Bonus;
