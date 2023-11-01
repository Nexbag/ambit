import mongoose from "mongoose";
import { InvestmentResponseType } from "../js/dataTypes";

const investment = new mongoose.Schema<InvestmentResponseType>(
  {
    username: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    lastPayDate: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    activeDate: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    initialAmount: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },

    expired: {
      type: Boolean,
      default: false,
    },
    capitalPaid: {
      type: Boolean,
      default: false,
    },
    interestBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Investment =
  mongoose.models.Investment || mongoose.model("Investment", investment);
export default Investment;
