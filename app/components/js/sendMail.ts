import {
  Configuration,
  EmailsApi,
  EmailMessageData,
} from "@elasticemail/elasticemail-client-ts-axios";
import { MailProp } from "./dataTypes";

export const sendMassMail = async (
  details: MailProp,
  sender: { name: string; email: string } = {
    name: "Amber Trade",
    email: "ambertrade@mifxfinance.com",
  }
) => {
  const date = new Date().getFullYear();
const logo=`https://firebasestorage.googleapis.com/v0/b/storer-268bd.appspot.com/o/Amber%2Fcorporate%2Famber.png?alt=media&token=3e1d8220-971a-4ee5-a947-f926fc7eccef&_gl=1*78trt8*_ga*MTUxMjMyNTM2Ni4xNjkyMTQ0MzYx*_ga_CW55HF8NVT*MTY5ODgyMzEwMC44LjEuMTY5ODgyNTI4NC4zNy4wLjA.`
const image=`https://firebasestorage.googleapis.com/v0/b/storer-268bd.appspot.com/o/Amber%2Fcorporate%2Fman.jpg?alt=media&token=d08cb464-0434-4196-9ed6-2c89baa50312&_gl=1*1suvgy2*_ga*MTUxMjMyNTM2Ni4xNjkyMTQ0MzYx*_ga_CW55HF8NVT*MTY5ODgyMzEwMC44LjEuMTY5ODgyNTI2Ni41NS4wLjA.`

  try {
    const { emails, showImage } = details;

   

    const config = new Configuration({
      apiKey:
        "BA837FEBECE4E8C329C12EE80A813A9A91C4473A4E9B690631B42A90C70F9A5EA856AB770C6471FB5EDA1E87F818335E",
    });

    const emailsApi = new EmailsApi(config);

    if (emails.length < 5) {
      for (let i = 0; i < emails.length; i++) {
        const mail=emails[i];
        const message = `<div style="background-color:##d4def4;color:#000012; padding: 0px 5%;font-family: Open Sans, sans-serif ">

        <div style="width: 100%; box-sizing: border-box;text-align:center;   padding:12px;">
           <img
             src="${logo}"
             alt="amber-trade.com"
            style="width: 150px; height:50px; object-fit:contain"/>
            </div>
           ${
             showImage
               ? ` <div style="width: 100%; box-sizing: border-box;">
             <img
             src="${image}"
            style="width: 100%; height:250px; object-fit:cover; object-position:center"/>
            </div>`
               : ""
           }
       
            <div style="padding: 24px; background:#000000;color:#ffffff;font-size:0.9rem">
            
            <h2 style="font-size:1rem; font-weight:600; color:#87ffa1">Hello ${
              mail.username.slice(0, 1).toUpperCase() + mail.username.slice(1)
            },</h2>
            
            ${mail.messageData}
            </div>
          
          <div
            style="
            box-sizing: border-box;
              width: 100%;
              padding: 12px;
              font-size: 0.9rem;"
          >
            <p>For questions and support, please mail us  at <a href="mailto:support@amber-trade.com" style="color:inherit;text-decoration:none;">support@amber-trade.com</a></p> <p style="text-decoration:none; color:inherit; ">${
              process.env.NEXT_PUBLIC_SERVER_URL
            }</p>
      <p>&copy; ${date} <a style="text-decoration:none; color:inherit;">amber-trade.com</a> All Rights Reserved</p>
          </div> </div>`;
        const emailMessageData: EmailMessageData = {
          Recipients: [
            {
              Email: emails[i].email.email,
              Fields: {
                name: emails[i].email.name,
              },
            },
          ],
          Content: {
            Body: [
              {
                ContentType: "HTML",
                Charset: "utf-8",
                Content: message,
              },
            ],
            From: `${sender.name} <${sender.email}>`,
            Subject: emails[i].subject,
          },
        };

        await emailsApi.emailsPost(emailMessageData);
      }
    } else {
      const message = `<div style="background-color:##d4def4;color:#000012; padding: 0px 5%;font-family: Open Sans, sans-serif ">

      <div style="width: 100%; box-sizing: border-box;text-align:center;   padding:12px;">
         <img
           src="${logo}"
           alt="amber-trade.com"
          style="width: 150px; height:50px; object-fit:contain"/>
          </div>
         ${
           showImage
             ? ` <div style="width: 100%; box-sizing: border-box;">
           <img
           src="${image}"
          style="width: 100%; height:250px; object-fit:cover; object-position:center"/>
          </div>`
             : ""
         }
     
          <div style="padding: 24px; background:#000000;color:#ffffff;font-size:0.9rem">
          
          <h2 style="font-size:1rem; font-weight:600; color:#87ffa1">Dear Esteemed client,</h2>
          
          ${emails[0].messageData}
          </div>
        
        <div
          style="
          box-sizing: border-box;
            width: 100%;
            padding: 12px;
            font-size: 0.9rem;"
        >
          <p>For questions and support, please mail us  at <a href="mailto:support@amber-trade.com" style="color:inherit;text-decoration:none;">support@amber-trade.com</a></p> <p style="text-decoration:none; color:inherit; ">${
            process.env.NEXT_PUBLIC_SERVER_URL
          }</p>
    <p>&copy; ${date} <a style="text-decoration:none; color:inherit;">amber-trade.com</a> All Rights Reserved</p>
        </div> </div>`;
      const emailMessageData: EmailMessageData = {
        Recipients: emails.map((e) => {
          const detail = {
            Email: e.email.email,
            Fields: {
              name: e.email.name,
            },
          };
          return detail;
        }),
        Content: {
          Body: [
            {
              ContentType: "HTML",
              Charset: "utf-8",
              Content: message,
            },
          ],
          From: `${sender.name} <${sender.email}>`,
          Subject: emails[0].subject,
        },
      };

      await emailsApi.emailsPost(emailMessageData);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default sendMassMail;
