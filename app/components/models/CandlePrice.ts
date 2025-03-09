import mongoose from "mongoose";
import { DbRawCandleResponseType } from "../js/dataTypes";

const dbRawCandle = new mongoose.Schema<DbRawCandleResponseType>(
  {
    Data: {
      type: [],
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
  },
  { timestamps: true }
);

const DbRawCandle =
  mongoose.models.DbRawCandle || mongoose.model("DbRawCandle", dbRawCandle);
export default DbRawCandle;
