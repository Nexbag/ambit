import jwt from "jsonwebtoken";
import { UserResponseType } from "./dataTypes";
const verifyToken = (token: string): UserResponseType =>
  jwt.verify(token, `${process.env.SECRET}`) as UserResponseType;

export const makeToken = (user: UserResponseType): UserResponseType => {
  const { password, ...other } = user;

  const mToken = jwt.sign(other, `${process.env.SECRET}`, {
    expiresIn: "12h",
  });

  const userToReturn: UserResponseType = {
    ...other,
    password: "",
    token: mToken,
  };
  return userToReturn;
};
export const makeWalletAddress = (coinName: string) => {
  const initials = coinName.split(" ");
  let initial = "";
  initials.forEach((e) => {
    initial += e[0].toLowerCase();
  });
  const digit = new Date().getTime();
  const rand = `${initial}${
    digit + Math.round(Math.random() * digit * 200 * 12 * 4 * 8 * Math.random())
  }`;
  const diffInLength = rand.length < 16 ? 16 - rand.length : 0;
  const addToSub = rand + "0".repeat(diffInLength);

  return addToSub.slice(0, 16);
};
export default verifyToken;
