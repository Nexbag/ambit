import mongoose from "mongoose";
import { DbRawPriceResponseType } from "../js/dataTypes";

const dbRawPrice = new mongoose.Schema<DbRawPriceResponseType>(
  {
    prices: {
      type: [[Number]],
      required: true,
    },
    coin: {
      type: String,
      required: true,
    },

    date: {
      type: Number,
      required: true,
    },
    interval: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const DbRawPrice =
  mongoose.models.DbRawPrice || mongoose.model("DbRawPrice", dbRawPrice);
export default DbRawPrice;
