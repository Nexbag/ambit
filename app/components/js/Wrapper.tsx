"use client";
import React, { createContext, useEffect, useState, useContext } from "react";
import Script from "next/script";
import { UserResponseType } from "./dataTypes";

import { useRouter } from "next/navigation";

import { postRequest } from "./api_client";
import { tokenUrl } from "./config";
export interface Props {
  children?: React.ReactNode;
}

export interface UserContextType {
  user: UserResponseType | null;
  referredBy: string;
  logout: () => void;
  logIn: (user: UserResponseType) => void;
  setReferredBy: (text: string) => void;
  setUser: (user: UserResponseType) => void;
}
export const UserContext = createContext<UserContextType | null>(null);
export const useUserContext = () => useContext(UserContext) as UserContextType;

export default function Wrap({ children }: Props) {
  const [user, setUser] = useState<UserResponseType | null>(null);
  const [referredBy, setReferredBy] = useState<string>("");

  const router = useRouter();
  const logout = () => {
    document.cookie = "token=; path=/";
    document.cookie = "token=; path=/dashboard";
    document.cookie = "token=; path=/login";
    document.cookie = "token=; path=/signup";
    setUser(() => null);
    location.reload();
  };

  const logIn = (user: UserResponseType) => {
    const date: Date = new Date();
    const expireDate: number = date.getFullYear() + 2;
    date.setFullYear(expireDate);
    document.cookie = `token=${user.token};Expires=${date}; path=/`;
    document.cookie = `token=${user.token};Expires=${date}; path=/login`;
    document.cookie = `token=${user.token};Expires=${date}; path=/dashboard`;
    document.cookie = `token=${user.token};Expires=${date}; path=/signup`;
    setUser(user);

    router.replace("/dashboard");
  };
  const updateUser = (uzer: UserResponseType) => {
    uzer.token = user?.token || "";
    setUser(uzer);
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        return;
      }
      try {
        const cookies = document.cookie?.split(";");
        const bearer = cookies?.filter((cookie) => {
          return cookie.includes("token");
        });
        let bearerToken: string | null;
        if (bearer?.length) {
          bearerToken = bearer[0].split("=")[1];
        } else {
          bearerToken = null;
        }

        if (bearerToken) {
          const { data } = await postRequest(
            tokenUrl,
            {
              token: bearerToken,
            },
            bearerToken
          );

          setUser(data);
        }
      } catch (error) {}
    };
    getUser();
  }, [user?.token]);

  return (
    <div>
      <UserContext.Provider
        value={{
          logIn,
          user,
          setUser: updateUser,
          referredBy,
          setReferredBy,
          logout,
        }}
      >
        {children}
      </UserContext.Provider>

      <Script
        type="text/javascript"
        id={"zsiqchat"}
        src="//code.tidio.co/sleu2w98fkken1tlwjkj6f3tszonn7ch.js"
      /> 
    
    </div>
  );
}
