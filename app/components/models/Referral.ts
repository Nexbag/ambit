import mongoose from "mongoose";
import { ReferralResponseType } from "../js/dataTypes";

const referral = new mongoose.Schema<ReferralResponseType>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    rUsername: {
      type: String,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Referral =
  mongoose.models.Referral || mongoose.model("Referral", referral);
export default Referral;
