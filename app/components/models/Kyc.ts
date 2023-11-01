import mongoose from "mongoose";
import { KYCResponseType } from "../js/dataTypes";

const kyc = new mongoose.Schema<KYCResponseType>(
  {
    username: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Kyc = mongoose.models.Kyc || mongoose.model("Kyc", kyc);
export default Kyc;
