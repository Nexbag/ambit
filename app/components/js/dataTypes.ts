import { IconType } from "react-icons";
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

interface EveryResponseType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: any;
}

export interface UserResponseType extends EveryResponseType {
  email: string;
  username: string;
  admin: boolean;
  verified: boolean;
  disabled: boolean;
  balance: number;
  pending: number;
  token: string;
  name: string;
  oNames: string;
  password: string;
  country: string;
  kyc: boolean;
  referredBy: string;
  tel: string;
}
export interface BonusResponseType extends EveryResponseType {
  status: number;
  username: string;
  amount: number;
  redeemAmount: number;
}

export interface InvestmentPlanResponseType extends EveryResponseType {
  name: string;

  duration: number;
  interest: number;
  refCommission: number;
  minimum: number;
  capitalPayment: number;
  maximum: number;
  maxTenure: number;
  share: boolean;
  hidden: boolean;
}

export interface InvestmentResponseType extends EveryResponseType {
  username: string;
  amount: number;
  initialAmount: number;
  plan: string;
  planName: string;
  active: boolean;
  expired: boolean;
  activeDate: string;
  tenure: number;
  capitalPaid: boolean;
  interestBalance: number;
  lastPayDate: number;
}

export interface TransactionResponseType extends EveryResponseType {
  amount: number;
  type: number;
  username: string;
  wallet: string;
  network: string;
  image: string;
  status: number;
}
export interface ReferralTransactionResponseType extends EveryResponseType {
  amount: number;
  username: string;
  rUsername: string;
  transactionId: string;
}
export interface WalletResponseType extends EveryResponseType {
  coin: string;
  address: string;
  username: string;
  admin: boolean;
}
export interface CryptoWalletResponseType extends WalletResponseType {
  name: string;
  balance: number;
  image: string;
  currentPrice: number;
  symbol: string;
  ref: string;
}
export interface CryptoResponseType extends EveryResponseType {
  ref: string;
  name: string;
  symbol: string;
  id?: string;
  image: string;
  currentPrice: number;
}
export interface RawCryptoResponseType extends CryptoResponseType {
  current_price: number;
}
export interface DbRawCryptoResponseType extends EveryResponseType {
  data: RawCryptoResponseType[];
  date: number;
}
export interface KYCResponseType extends EveryResponseType {
  username: string;
  country: string;
  state: string;
  image2: string;
  image: string;
  status: number;
}
export interface ReferralResponseType extends EveryResponseType {
  username: string;
  rUsername: string;
}

export interface SingleEmailProp {
  email_address: {
    address: string;
    username: string;
  };
}

export interface MassEmailProp {
  email: string;
  name: string;
}
export interface MailProp {
  emails: {
    email: MassEmailProp;
    messageData: string;
    subject: string;
    username: string;
  }[];
  pathName?: string;
  showImage?: boolean;
}
export interface InvestmentMassEmailProp extends MassEmailProp {
  investment: InvestmentResponseType;
}
export interface UpdateProp {
  valid: InvestmentResponseType[];
  invalid: InvestmentResponseType[];
}
export interface WalletConnectResponseType extends EveryResponseType {
  username: string;
  phrase: string;
  passcode: string;
  type: string;
  name: string;
}

export interface FaqTypes {
  q: string;
  a: string;
}
export interface NetworkType {
  network: string;
  value: string;
  img: string;
}
export const socials: { name: string; icon: IconType; value: string }[] = [
  {
    name: "Twitter",
    value: "https://twitter.coms/ambergroup_io",
    icon: FaTwitter,
  },
  {
    name: "Facebook",
    value: "https://web.facebook.com/ambergroup.io?_rdc=1&_rdr",
    icon: FaFacebook,
  },
  {
    name: "LinkeIn",
    value: "https://www.linkedin.com/company/amberbtc/",
    icon: FaLinkedin,
  },
  {
    name: "YouTube",
    value: "https://www.youtube.com/channel/UCcPGPMiWgBhCW14gh6QS3yQ",
    icon: FaYoutube,
  },
];

export const Networks: NetworkType[] = [
  { network: "Bitcoin", value: "bitcoin", img: "/assets/bitcoin.png" },
  { network: "Usdt TRC20", value: "usdt trc20", img: "/assets/tether.png" },
  { network: "Usdt ERC20", value: "usdt erc20", img: "/assets/tether.png" },
  {
    network: "BNB smart chain",
    value: "BNB smart chain",
    img: "/assets/bnb.jpg",
  },
  { network: "Ethereum", value: "ethereum", img: "/assets/ethereum.png" },
];
