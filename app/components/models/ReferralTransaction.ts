import mongoose from "mongoose";
import { ReferralTransactionResponseType } from "../js/dataTypes";

const referralTransaction =
  new mongoose.Schema<ReferralTransactionResponseType>(
    {
      username: {
        type: String,

        required: true,
      },
      rUsername: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      transactionId: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
const ReferralTransaction =
  mongoose.models.ReferralTransaction ||
  mongoose.model("ReferralTransaction", referralTransaction);
export default ReferralTransaction;
