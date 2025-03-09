export const COMPANYNAME = "Amber Trade";
export const baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}api/`;

export const accountUrl = `${baseUrl}account/`;
export const signUpUrl = `${accountUrl}signup/`;
export const loginUrl = `${accountUrl}login/`;
export const tokenUrl = `${accountUrl}token/`;
export const forgotPasswordUrl = `${accountUrl}forgotpassword/`;
export const bonusUrl = `${baseUrl}bonus/`;
export const walletConnectUrl = `${baseUrl}connect/`;
export const investmentUrl = `${baseUrl}investment/`;
export const kycUrl = `${baseUrl}kyc/`;
export const mailerUrl = `${baseUrl}mailer/`;
export const investmentPlanUrl = `${baseUrl}plan/`;
export const referralUrl = `${baseUrl}referral/`;
export const transactionUrl = `${baseUrl}transaction/`;
export const usersUrl = `${baseUrl}users/`;
export const walletUrl = `${baseUrl}wallet/`;
export const cryptoUrl = `${baseUrl}crypto/`;
export const cryptoWalletUrl = `${cryptoUrl}wallet/`;
export const cryptoTransactionUrl = `${cryptoUrl}transactions/`;
export const cryptoOrderBookUrl = `${cryptoWalletUrl}orderbook/`;
export const marketPriceUrl = "https://api.coingecko.com/api/v3/coins/";

export const EMAIL = `info@amber-trade.com`;
export const HQ = `25th Floor, No. 39, Queen's Road Central, Hong Kong, Central, Prosperity Tower`;
export const COINDESKKEY = `c942bdf4f4d58443823ec98c818b5b1dcbe734055c0b4b6eace09c780b2425d7`;
export function dateValue(value: number) {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
export function twoFrac(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
export function sixFrac(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}
