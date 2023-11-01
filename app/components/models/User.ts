import mongoose from "mongoose";
import { UserResponseType } from "../js/dataTypes";

const user = new mongoose.Schema<UserResponseType>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    oNames: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "",
    },
    referredBy: {
      type: String,
      default: "",
    },
    tel: {
      type: String,
      default: "",
    },

    admin: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    balance: {
      type: Number,
      default: 0,
    },
    pending: {
      type: Number,
      default: 0,
    },

    kyc: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", user);
export default User;
