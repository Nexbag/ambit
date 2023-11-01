import mongoose from "mongoose";
import { InvestmentPlanResponseType } from "../js/dataTypes";

const investmentPlan = new mongoose.Schema<InvestmentPlanResponseType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    duration: {
      type: Number,
      required: true,
    },
    interest: {
      type: Number,
      required: true,
    },
    refCommission: {
      type: Number,
      required: true,
    },
    minimum: {
      type: Number,
      required: true,
    },
    maximum: {
      type: Number,
      required: true,
    },
    capitalPayment: {
      type: Number,
      required: true,
    },
    maxTenure: {
      type: Number,
      required: true,
    },

    share: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const InvestmentPlan =
  mongoose.models.InvestmentPlan ||
  mongoose.model("InvestmentPlan", investmentPlan);
export default InvestmentPlan;
