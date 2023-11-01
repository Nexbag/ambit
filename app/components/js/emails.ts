import { BonusResponseType, InvestmentMassEmailProp } from "./dataTypes";
import {
  InvestmentPlanResponseType,
  InvestmentResponseType,
  MailProp,
  TransactionResponseType,
  UserResponseType,
} from "./dataTypes";
export const btnStyle =
  "font-size:1rem; font-weight:600; color:#000000; background-color:#87ffa1; padding:12px; width:100%; display:block;text-align:center; text-decoration:none;margin:15px 0px;box-sizing: border-box;";
export const welcomeMessage = (user: UserResponseType): MailProp => {
  return {
    emails: [
      {
        email: {
          email: `${user.email}`,
          name: `${user.username}`,
        },
        subject: "Welcome to Amber Trade",
        username: `${user?.username}`,
        messageData: `<p>
               Welcome to Amber Trade! We are your cryptocurrency mining, trading and exchange platform and the best choice for profitable cryptocurrency investments.</p>
           <p>Click the link below to verify your email or copy this link to your browser</p> <a href="${process.env.NEXT_PUBLIC_SERVER_URL}dashboard?vrcToken=${user?.token}" style="${btnStyle}">Verify Me</a><p><a style="text-decoration:none; color:inherit; " href="${process.env.NEXT_PUBLIC_SERVER_URL}dashboard?vrcToken=${user?.token}">${process.env.NEXT_PUBLIC_SERVER_URL}dashboard?vrcToken=${user?.token}</a></p>`,
      },
      {
        email: {
          email: `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
          name: `Admin`,
        },
        subject: `${user.username} just signed up at Amber Trade`,
        username: `Admin`,
        messageData: `<p>
               A new user signed up on your website.</p>
           <p>Click the link below to visit your site</p> <a href="${process.env.NEXT_PUBLIC_SERVER_URL}dashboard" style="${btnStyle}">MY DASHBOARD</a>`,
      },
    ],
    showImage: true,
  };
};

export const refMessage = (
  user: UserResponseType,
  rUser: UserResponseType
): MailProp => {
  return {
    emails: [
      {
        email: {
          email: `${rUser.email}`,
          name: `${rUser.username}`,
        },
        subject: `${
          user.username[0].toUpperCase() + user.username.slice(1)
        } just signed up using your referral link!`,
        username: `${rUser?.username}`,
        messageData: `<p>
              Thank you for referring ${
                user.username[0].toUpperCase() + user.username.slice(1)
              } to our platform. You will earn a referral commission on every new deposit.
           </p>
           <p>Kindly encourage the new user to make their first deposit to enjoy stressfree income.</p
 <a href="${
   process.env.NEXT_PUBLIC_SERVER_URL
 }dashboard" style="${btnStyle}">My Dashboard</a>`,
      },
    ],
    showImage: true,
  };
};
export const transactionEndMessage = (
  user: UserResponseType,
  transaction: TransactionResponseType
): MailProp => {
  return {
    emails: [
      {
        email: {
          email: `${user.email}`,
          name: user.username,
        },
        subject:
          transaction.status == 1
            ? `Your ${
                transaction.type == 0 ? "withdrawal request" : "deposit"
              } of $${transaction.amount.toLocaleString(
                "USA"
              )} has been confirmed.`
            : `Your ${
                transaction.type == 0 ? "withdrawal request" : "deposit"
              } of $${transaction.amount} was declined.`,
        username: user.username,
        messageData:
          transaction.status == 1
            ? `<p>Your ${
                transaction.type == 0 ? "withdrawal request" : "deposit"
              } of $${transaction.amount} has been confirmed. ${
                transaction.type == 0
                  ? `We have credited your ${transaction.network} wallet ${transaction.wallet} with $${transaction.amount}.`
                  : ""
              } <br/> Thank you for choosing Amber Trade. </p> <a href="${
                process.env.NEXT_PUBLIC_SERVER_URL
              }/dashboard" style="${btnStyle}">My Dashboard</a>`
            : `<p>Your ${
                transaction.type == 0 ? "withdrawal request" : "deposit"
              } was declined. Please confirm the transaction details and try again. <br/> Thank you for choosing Amber Trade. </p> <a href="${
                process.env.NEXT_PUBLIC_SERVER_URL
              }/dashboard" style="${btnStyle}">My Dashboard</a>`,
      },
    ],
  };
};
export const transactionStartMessage = (
  user: UserResponseType,
  transaction: TransactionResponseType
): MailProp => {
  return transaction.type == 1
    ? {
        emails: [
          //   {
          //     email: {
          //       email: `${user.email}`,
          //       name: `${user.username}`,
          //     },
          //     subject: `Your deposit of $${transaction.amount.toLocaleString(
          //       "USA"
          //     )} is pending.`,
          //     username: `${user.username}`,
          //     messageData: `<p>We have added your deposit of $${transaction.amount.toLocaleString(
          //       "USA"
          //     )} to our ledger. We will notify you immediately we confirm the deposit. Thank you for contributing to this project.
          // </p>`,
          //   },
          {
            email: {
              email: `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
              name: `Admin`,
            },
            subject: `${transaction.username.toUpperCase()} made a deposit of $${transaction.amount.toLocaleString(
              "USA"
            )}.`,

            username: `Admin`,
            messageData: `<p>You have a pending deposit of $${transaction.amount.toLocaleString(
              "USA"
            )} from ${transaction.username.toUpperCase()} </p>`,
          },
        ],
      }
    : {
        emails: [
          //   {
          //     email: {
          //       email: `${user?.email}`,
          //       name: `${user?.username}`,
          //     },
          //     subject: `Your withdrawal of $${transaction.amount.toLocaleString(
          //       "USA"
          //     )} is pending.`,

          //     username: `${user?.username}`,
          //     messageData: `<p>We have added your withdrawal of $${transaction.amount.toLocaleString(
          //       "USA"
          //     )} to our ledger. We will notify you immediately we confirm the transaction. Thank you for contributing to this project.
          // </p>`,
          //   },
          {
            email: {
              email: `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
              name: `Admin`,
            },
            subject: `${transaction.username.toUpperCase()} wants to withdraw $${transaction.amount.toLocaleString(
              "USA"
            )}.`,

            username: `Admin`,
            messageData: `<p>${transaction.username.toUpperCase()} wants to withdraw $${transaction.amount.toLocaleString(
              "USA"
            )} to his ${transaction.network} wallet address ${
              transaction.wallet
            }</p>`,
          },
        ],
      };
};

export const refTransactionMessage = (
  user: UserResponseType,
  rUser: UserResponseType,
  amount: number
): MailProp => {
  return {
    emails: [
      {
        email: {
          email: `${rUser.email}`,
          name: rUser.username,
        },
        subject: `You just earned a referral bonus`,
        username: rUser.username,
        messageData: `<p>User  ${
          user.username
        } just made a deposit. We have funded your dashboard with $${amount.toLocaleString(
          "USA"
        )} as a referral commission. <br/> Thank you for referring. </p> <a href="${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/dashboard" style="${btnStyle}">View Balance</a>`,
      },
    ],
  };
};
export const transferEndMessage = (
  sender: UserResponseType,
  receiver: UserResponseType,
  amount: number
): MailProp => {
  return {
    emails: [
      {
        email: {
          email: sender.email,
          name: sender.username,
        },
        subject: `Your transfer to ${receiver.username.toUpperCase()} has been processed`,

        username: sender.username,
        messageData: `<p>${receiver.username.toUpperCase()} has received your transfer of $${amount}.</p><p> Keep investing!
        </p>`,
      },
      {
        email: {
          email: receiver.email,
          name: receiver.username,
        },
        subject: `${sender.username.toUpperCase()} just sent you money.`,

        username: receiver.username,
        messageData: `<p>${sender.username.toUpperCase()} just transferred $${amount} to you.</p><p> Keep investing!
        </p>`,
      },
    ],
  };
};

export const transferFailMessage = (
  sender: UserResponseType,
  amount: number
): MailProp => {
  return {
    emails: [
      {
        email: {
          email: sender.email,
          name: sender.username,
        },
        subject: `Your transfer request was declined`,

        username: sender.username,
        messageData: `<p>Your transfer request of $${amount.toLocaleString(
          "USA"
        )} was declined. Please try again or contact support.
        </p>`,
      },
    ],
  };
};
export const transferStartMessage = (user: UserResponseType): MailProp => {
  return {
    emails: [
      {
        email: {
          email: `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
          name: `Admin`,
        },
        subject: `${user.username.toUpperCase()} wants to make a transfer`,

        username: "Admin",
        messageData: `<p>${user.username.toUpperCase()} wants to transfer.
        </p>`,
      },
    ],
  };
};
export const investmentStartMessage = (
  user: UserResponseType,
  investment: InvestmentResponseType,
  plan: InvestmentPlanResponseType
): MailProp => {
  return {
    emails: [
      {
        email: {
          email: `${user?.email}`,
          name: `${user?.username}`,
        },
        subject: `Your investment of ${plan.name} investment is now running`,

        username: `${user?.username}`,
        messageData: `<p>Your ${
          plan.name
        } plan investment of $${investment.amount.toLocaleString(
          "USA"
        )} is now running.
        </p>
        <p>
        You will earn $${(
          (plan.interest * investment.amount) /
          plan.duration
        ).toLocaleString("USA")} daily for ${plan.duration} days.
        </p> <p>Thank you for choosing us.</p><a href="${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/dashboard/transaction/investments" style="${btnStyle}">My Investments</a>`,
      },
    ],
  };
};

export const investmentCapitalMessage = (
  emails: InvestmentMassEmailProp[]
): MailProp => {
  return {
    emails: emails.map((email) => {
      return {
        subject: "You just got paid",
        username: email.name,
        messageData: `<p>Your ${
          email.investment.planName
        } investment of $${email.investment.amount.toLocaleString(
          "USA"
        )} has matured.</p><a href='${
          process.env.NEXT_PUBLIC_SERVER_URL
        }dashboard' style="${btnStyle}">My Dashboard</a>`,
        email: {
          email: email.email,
          name: email.name,
        },
      };
    }),
  };
};

export const forgotPasswordMessage = (user: UserResponseType): MailProp => {
  return {
    emails: [
      {
        email: { email: user.email, name: user.username },
        username: user.username,
        subject: "Password reset",
        messageData: `<p>
      Someone requested a password reset for your account, if you are the one please follow the link to reset your password.
      </p>
      <p>Click the link below to reset your password or copy this link to your browser </p>${process.env.NEXT_PUBLIC_SERVER_URL}forgotpassword?token=${user.token}<p>
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL}forgotpassword?token=${user.token}" style="${btnStyle}">Reset Password</a>`,
      },
    ],
  };
};
export const KYCMessage = (
  user: UserResponseType,
  status: number
): MailProp => {
  return status == -1
    ? {
        emails: [
          {
            email: {
              email: `${user.email}`,
              name: `${user.username}`,
            },
            subject: `Your KYC data submission has been reviewed `,

            username: `${user.username}`,
            messageData: `<p>Your KYC data has been reviewed and it did not meet up with our standard. Please try again.</p>`,
          },
        ],
        showImage: true,
      }
    : {
        emails: [
          {
            email: {
              email: `${user.email}`,
              name: `${user.username}`,
            },
            subject: `Your KYC data submission has been reviewed `,
            username: `${user.username}`,
            messageData: `<p>Your KYC data has been verified. We have removed all restrictions from your account.</p>`,
          },
        ],
        showImage: true,
      };
};
export const KYCMessageAdmin = (): MailProp => {
  return {
    emails: [
      {
        email: {
          email: `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
          name: `Admin`,
        },
        subject: `You have a pending KYC `,
        username: `Admin`,
        messageData: `<p>You have a pending KYC submission</p>`,
      },
    ],
  };
};
export const BonusMessageEnd = (
  user: UserResponseType,
  bonus: BonusResponseType
): MailProp => {
  return bonus.status == 1
    ? {
        emails: [
          {
            email: {
              email: user.email,
              name: user.username,
            },
            subject: `You have redeemed your bonus.`,
            username: user.username,
            messageData: `<p>Your bonus has been redeemed. You can now invest with the funds.<p/> 
        <a href="${process.env.NEXT_PUBLIC_SERVER_URL}dashboard" style="${btnStyle}">View Balance</a>`,
          },
        ],
      }
    : {
        emails: [
          {
            email: {
              email: user.email,
              name: user.username,
            },
            subject: `Your bonus has expired`,
            username: user.username,
            messageData: `<p>Your bonus of $${bonus.amount.toLocaleString(
              "USA"
            )} was not redeemed and we have removed it from your bonus balance. </p> <a href="${
              process.env.NEXT_PUBLIC_SERVER_URL
            }dashboard" style="${btnStyle}">View Balance</a>`,
          },
        ],
      };
};
export const BonusMessageStart = (
  user: UserResponseType,
  bonus: BonusResponseType
): MailProp => {
  return {
    emails: [
      {
        email: {
          email: user.email,
          name: user.username,
        },
        subject: `You just received a bonus `,
        username: user.username,
        messageData: `<p>You just earned a bonus! Contact support for more details<p/> <a href="${process.env.NEXT_PUBLIC_SERVER_URL}dashboard" style="${btnStyle}">View Balance</a>`,
      },
    ],
  };
};
