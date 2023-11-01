import axios from "axios";
import { MailProp } from "./dataTypes";

export const sendMassMail = async (
  details: MailProp,
  sender: { name: string; email: string } = {
    name: "Amber Trade",
    email: "amber@trustsealcapital.com",
  }
) => {
  const date = new Date().getFullYear();
const logo=`https://firebasestorage.googleapis.com/v0/b/storer-268bd.appspot.com/o/Amber%2Fcorporate%2Famber.png?alt=media&token=3e1d8220-971a-4ee5-a947-f926fc7eccef&_gl=1*78trt8*_ga*MTUxMjMyNTM2Ni4xNjkyMTQ0MzYx*_ga_CW55HF8NVT*MTY5ODgyMzEwMC44LjEuMTY5ODgyNTI4NC4zNy4wLjA.`
const image=`https://firebasestorage.googleapis.com/v0/b/storer-268bd.appspot.com/o/Amber%2Fcorporate%2Fman.jpg?alt=media&token=d08cb464-0434-4196-9ed6-2c89baa50312&_gl=1*1suvgy2*_ga*MTUxMjMyNTM2Ni4xNjkyMTQ0MzYx*_ga_CW55HF8NVT*MTY5ODgyMzEwMC44LjEuMTY5ODgyNTI2Ni41NS4wLjA.`

  try {
    const { emails, showImage } = details;

    await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          name: sender.name,
          email: sender.email,
        },
        messageVersions: emails.map((mail) => {
          const message = `<div style="background-color:##d4def4;color:#000012; padding: 0px 5%;font-family: Open Sans, sans-serif ">

          <div style="width: 100%; box-sizing: border-box;text-align:center;   padding:12px;">
             <img
               src="${logo}"
               alt="ambertrade.pro"
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
              <p>For questions and support, please mail us  at <a href="mailto:support@ambertrade.pro" style="color:inherit;text-decoration:none;">support@ambertrade.pro</a></p> <p style="text-decoration:none; color:inherit; ">${
                process.env.NEXT_PUBLIC_SERVER_URL
              }</p>
        <p>&copy; ${date} <a style="text-decoration:none; color:inherit;">ambertrade.pro</a> All Rights Reserved</p>
            </div> </div>`;
          return {
            to: [
              {
                email: mail.email.email,
                name: mail.email.name.toUpperCase(),
              },
            ],
            subject: mail.subject,
            htmlContent: `<html><head></head><body>${message}</html>`,
          };
        }),
        subject: emails[0].subject,
        htmlContent: emails[0].messageData,
      },
      {
        headers: {
          "api-key": `${process.env.SENDBLUE_TOKEN}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default sendMassMail;
