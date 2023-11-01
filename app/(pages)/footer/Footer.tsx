"use client";
import Link from "next/link";
import styles from "./Footer.module.scss";

import Image from "next/image";
import { COMPANYNAME } from "@/app/components/js/config";
import { IconType } from "react-icons/lib";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { FiMail, FiTwitter } from "react-icons/fi";
interface Link {
  name: string;
  link: string;
}
interface Row {
  main: string;
  links: Link[];
}

const Footer: React.FC = () => {
  const links: Row[] = [
    {
      main: "Quick Links",
      links: [
        {
          name: "Home",
          link: "/",
        },
        {
          name: "About Us",
          link: "/about",
        },

        {
          name: "Compliance Policy",
          link: "/about/compliance_policy",
        },
        {
          name: "Careers",
          link: "/careers",
        },

        {
          name: "Disclaimer",
          link: "/disclaimer",
        },
      ],
    },
    {
      main: "Other Links",
      links: [
        { name: "Login", link: "/login" },

        { name: "Terms of Use", link: "/privacy" },
        { name: "Privacy Policy", link: "/privacy" },
        {
          link: "/sustainability",
          name: "Sustainability",
        },
        {
          link: "/protect_client",
          name: "Protecting our clients",
        },
        {
          link: "/plan_calculator",
          name: "Plan calculator",
        },
      ],
    },
  ];
  const socials: { icon: IconType; link: string }[] = [
    {
      icon: FaFacebookF,
      link: "https://www.facebook.com/",
    },
    {
      icon: FiTwitter,
      link: "https://twitter.com/home",
    },
    {
      icon: FaInstagram,
      link: "https://www.instagram.com/?hl=en",
    },
    {
      icon: FaLinkedinIn,
      link: "https://www.linkedin.com/login",
    },
    {
      icon: FiMail,
      link: "mailto:support@hexagonminers.com",
    },
  ];
  const date = new Date();
  return (
    <div className={styles.box}>
      <footer className={styles.footer}>
        <div className={styles.top}>
          <div className={styles.company}>
            <div className={styles.logo}>
              <Image src={"/logo.svg"} fill alt={COMPANYNAME} />
            </div>
            <h4>{COMPANYNAME}</h4>
            <p>{`At ${COMPANYNAME}, we understand that financial well-being is the cornerstone of a secure and prosperous future. We are dedicated to empowering individuals, families, and businesses with a comprehensive suite of financial solutions tailored to your unique needs.`}</p>
          </div>
          {links.map((link, index) => {
            return (
              <div key={index} className={styles.links}>
                <p>{link.main}</p>
                <ul>
                  {link.links.map((subLink, index) => {
                    return (
                      <li key={index}>
                        <Link href={subLink.link}>{subLink.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className={styles.copy}>
          <p>
            &copy; {date.getFullYear()} {COMPANYNAME}. All rights reserved.{" "}
          </p>
          <div className={styles.socials}>
            {socials.map((e, i) => (
              <Link href={e.link} key={i}>
                <e.icon />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
