"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import { Topper, TopperType } from "@/app/components/js/carousel/Carousel";

import Spinner from "@/app/components/js/spinner/Spinner";
import { EMAIL, HQ, mailerUrl } from "@/app/components/js/config";
import { MailProp } from "@/app/components/js/dataTypes";
import { postRequest } from "@/app/components/js/api_client";
import showMessage from "@/app/components/js/showError";

export default function Visa_Documents() {
  const data: TopperType = {
    title: "Contact Us",
 
    text: [
      "Do you have any questions or complain? We advise you to use the online chat support for prompt response.",
      `Email: ${EMAIL}`,
      `Office: ${HQ}`,
    ],
  };
  const [message, setMessage] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [name, setName] = useState<string>("");
  const handleSubmit = async () => {
    setMessage("Please wait");
    const body: MailProp = {
      pathName: "contact",
      emails: [
        {
          email: {
            email:
              process.env.NODE_ENV == "production"
                ? "support@ambertrade.pro"
                : `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
            name: "Admin",
          },
          subject,
          username: "admin",
          messageData: `<p>You have a new message from ${name}. <br/> "${text}"</p><p>You can reply at ${tel} or ${email}</p> `,
        },
      ],
    };
    const { success, message } = await postRequest(mailerUrl, body);
    showMessage(
      setMessage,
      success
        ? "We have received your email and we will reply you soon."
        : message
    );
  };
  return (
    <div className={styles.main}>
      <div className={"top"}>
        <Topper data={data} />
      </div>
      <div className={styles.body}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h1>Write to us</h1>
          <p>We will reply within 48 hours</p>
          <label>Your full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Your Email Address</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Your Whatsapp Number</label>
          <input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
          <label>Subject</label>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <label>Body</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
          <button
            className="action"
            disabled={!email || !tel || !subject || !text}
          >
            Send Message
          </button>
        </form>
      </div>
      {message && <Spinner error={message} />}
    </div>
  );
}
