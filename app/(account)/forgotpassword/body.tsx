"use client";

import { useUserContext } from "@/app/components/js/Wrapper";
import { postRequest, putRequest } from "@/app/components/js/api_client";
import { forgotPasswordUrl } from "@/app/components/js/config";
import showMessage from "@/app/components/js/showError";
import Spinner from "@/app/components/js/spinner/Spinner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const params = useSearchParams();
  const { logIn } = useUserContext();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const handleIt = async () => {
      setError("Please wait...");
      let text = "";
      if (email) {
        const { data, success, message } = await postRequest(
          forgotPasswordUrl,
          { email }
        );
        text = success ? data.message : message;
      }
      if (password) {
        const { data, message } = await putRequest(
          forgotPasswordUrl,
          {
            password,
          },
          params.get("token") || ""
        );

        text = message;

        data && logIn(data);
      }
      showMessage(setError, text);
    };
    handleIt();
  };

  return (
    <div>
      <h1>Forgot Password?</h1>
      <p>Fill out the form to reset your password</p>
      {!params.get("token") ? (
        <form>
          <label>Email</label>

          <input
            required
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            placeholder="email"
            style={{ width: "100%" }}
          />

          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            disabled={email.length < 4}
            className={"btn"}
          >
            Send Password Reset Link
          </button>
        </form>
      ) : (
        <form>
          <label>Enter your new password</label>
          <div>
            {showPassword ? (
              <MdOutlineVisibilityOff
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            ) : (
              <MdOutlineVisibility
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              />
            )}

            <input
              required
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              placeholder="password"
            />
          </div>

          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            disabled={password.length < 3}
            className={"btn"}
          >
            Set Password
          </button>
        </form>
      )}
      <div>
        <Link href={"/login"}>Login instead</Link>
      </div>
      {error && <Spinner error={error} />}
    </div>
  );
}
