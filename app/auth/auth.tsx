"use client";
import Image from "next/image";
import { useUtilsContext } from "../context/utils-context";
import { useState } from "react";
import google from "~/public/icons/google-color-svgrepo-com.svg";
import Login from "./login";
import Signup from "./signup";
import { apiRequest } from "~/lib/utils/api-request";
import VerifyEmail from "./verify-email";
import ForgotPassword from "./forget-password/forget-password";
import ResetPassword from "./forget-password/reset-password";
import { signIn } from "next-auth/react";
import { useCurrentUrl } from "~/lib/utils/get-current-url";
import { BiArrowBack } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
const AuthPrompt = () => {
  const {
    authPopup,
    authPopupRef,
    authPopupVisible,
    toggleAuthPopup,
    setDisableToggle,
  } = useUtilsContext();
  const [currentAction, setCurrentAction] = useState<string>("log-in");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [username, setUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState(Array(4).fill(""));
  const previousActions: Record<string, string> = {
    "log-in": "log-in",
    "sign-up": "log-in",
    "verify-email": "sign-up",
    "forgot-password": "log-in",
    "forgot-password-verify-email": "forgot-password",
    "forgot-password-reset": "forgot-password-verify-email",
  };
  const handleSubmit = async (action: string) => {
    const loginFieldsFilled = email && password;
    const signupFieldsFilled = loginFieldsFilled && username;
    let isValid;
    switch (action) {
      case "log-in":
        isValid = loginFieldsFilled;
        break;
      case "sign-up":
        isValid = signupFieldsFilled;
        break;
      case "verify-email":
        isValid = verificationCode;
        break;
      case "forgot-password":
        isValid = email;
        break;
      case "forgot-password-verify-email":
        isValid = verificationCode;
        break;
      case "forgot-password-reset":
        isValid = password;

        break;
      default:
        console.warn(`Unhandled action type: ${action}`);
        return;
    }

    if (!isValid) {
      setError("All fields are required");
      return;
    }
    setError("");
    setSubmitting(true);
    setDisableToggle(true);
    const actionUrls: Record<string, string> = {
      "log-in": "/api/auth/login",
      "sign-up": "/api/auth/signup",
      "verify-email": "/api/auth/verify-email",
      "forgot-password": "/api/auth/forgot-password/check-email",
      "forgot-password-verify-email": "/api/auth/forgot-password/verify-email",
      "forgot-password-reset": "/api/auth/forgot-password/reset-password",
    };

    const codeString = verificationCode.join("");
    await apiRequest({
      url: actionUrls[action],
      method: "POST",
      body: {
        email,
        password,
        username,
        verificationCode: codeString,
      },
      onSuccess: async (response) => {
        const data = response;
        document.cookie = `email=${data.email}; Path=/;`;
        setSuccessful(true);
        switch (action as string) {
          case "sign-up":
            setTimeout(() => {
              setCurrentAction("verify-email");
              setSuccessful(false);
            }, 1500);
            break;

          case "verify-email":
            const { token } = data;
            document.cookie = `token=${token}; Path=/; Secure;`; // ✅ not HttpOnly
            window.dispatchEvent(new CustomEvent("userUpdated"));
            setTimeout(() => {
              toggleAuthPopup();
              setSuccessful(false);
              setVerificationCode(Array(4).fill(""));
              setCurrentAction("log-in");
            }, 1500);
            break;

          case "log-in":
            window.dispatchEvent(new CustomEvent("userUpdated"));
            setTimeout(() => {
              toggleAuthPopup();
              setSuccessful(false);
            }, 1500);
            break;

          case "forgot-password":
            setTimeout(() => {
              setSuccessful(false);
              setCurrentAction("forgot-password-verify-email");
            }, 1500);
            break;
          case "forgot-password-verify-email":
            setTimeout(() => {
              setSuccessful(false);
              setCurrentAction("forgot-password-reset");
            }, 1500);
            break;
          case "forgot-password-reset":
            window.dispatchEvent(new CustomEvent("userUpdated"));
            setTimeout(() => {
              setSuccessful(false);
              toggleAuthPopup();

              setCurrentAction("log-in");
            }, 1500);
            break;
          default:
            console.warn(`Unhandled action type: ${action}`);
            setSuccessful(false);
        }
      },
      onError: (error) => {
        setError(error);
      },
      onFinally: () => {
        setSubmitting(false);
        setDisableToggle(false);
      },
    });
  };
  const currentUrl = useCurrentUrl();
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: currentUrl || "/" });
  };

  return (
    authPopup && (
      <div className="fixed bottom-[0px]  h-full w-full  z-110 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
        <div
          className={`w-[500px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-fade-grey  items-center      ${
            authPopupVisible ? "" : "mid-popup-hidden"
          }`}
          ref={authPopupRef}
        >
          <div className="flex w-full justify-between">
            {[
              "verify-email",
              "forgot-password",
              "forgot-password-verify-email",
              "forgot-password-reset",
            ].includes(currentAction) && (
              <button
                className="p-2  rounded-full bg-grey self-end hover:bg-grey-blue"
                onClick={() => {
                  setCurrentAction(previousActions[currentAction]);
                  setError("");
                }}
              >
                <BiArrowBack className="w-5  text-white" />
              </button>
            )}

            <button
              className="p-2  rounded-full bg-grey self-end hover:bg-grey-blue self-end"
              onClick={toggleAuthPopup}
            >
              <FaXmark size={16} className="text-white" />
            </button>
          </div>
          <div className="flex items-center   flex-col gap-3  w-[350px]">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl text-white sf-black">
                {currentAction === "log-in" && "Log In"}
                {currentAction === "sign-up" && "Sign Up"}
                {["verify-email", "forgot-password-verify-email"].includes(
                  currentAction
                ) && "Verify Email"}
                {currentAction === "forgot-password-reset" && "Reset Password"}
                {currentAction === "forgot-password" && "Reset Password"}
              </h1>
              <p className="text-sm text-grey-blue">
                {currentAction === "log-in" ||
                  (currentAction === "sign-up" &&
                    "Join the community or log in to stay connected")}

                {["verify-email", "forgot-password-verify-email"].includes(
                  currentAction
                ) && (
                  <span>{`Enter the 4-digit code we sent to ${email}`}</span>
                )}
              </p>
            </div>
            {![
              "verify-email",
              "forgot-password",
              "forgot-password-verify-email",
              "forgot-password-reset",
            ].includes(currentAction) && (
              <>
                <button
                  className="w-full bg-white h-[40px] rounded-full px-4 flex items-center justify-center gap-3 relative"
                  onClick={() => handleSignIn()}
                >
                  <Image
                    src={google}
                    alt="google"
                    className="w-5 absolute  left-4"
                  />
                  <span className="text-sm text-black self-center sf-reg">
                    Continue with Google
                  </span>
                </button>
                <span className="text-center  uppercase text-sm text-grey-blue ">
                  or
                </span>
              </>
            )}

            {currentAction === "log-in" && (
              <Login
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                loading={submitting}
                success={successful}
                setError={setError}
                errorContent="All fields are required"
                setCurrentAction={setCurrentAction}
                submit={handleSubmit}
              />
            )}
            {currentAction === "sign-up" && (
              <Signup
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                setError={setError}
                errorContent="All fields are required"
                setCurrentAction={setCurrentAction}
                username={username}
                setUsername={setUsername}
                submit={handleSubmit}
                success={successful}
                loading={submitting}
              />
            )}
            {currentAction === "verify-email" && (
              <VerifyEmail
                error={error}
                setError={setError}
                isVerifying={submitting}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                success={successful}
                submit={handleSubmit}
                auth_action="verify-email"
              />
            )}
            {currentAction === "forgot-password" && (
              <ForgotPassword
                error={error}
                setEmail={setEmail}
                email={email}
                setError={setError}
                isChecking={submitting}
                success={successful}
                submit={handleSubmit}
              ></ForgotPassword>
            )}
            {currentAction === "forgot-password-verify-email" && (
              <VerifyEmail
                error={error}
                setError={setError}
                isVerifying={submitting}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                success={successful}
                submit={handleSubmit}
                auth_action="forgot-password-verify-email"
              />
            )}
            {currentAction === "forgot-password-reset" && (
              <ResetPassword
                email={email}
                password={password}
                setPassword={setPassword}
                setError={setError}
                error={error}
                setCurrentAction={setCurrentAction}
                submit={handleSubmit}
                success={successful}
                loading={submitting}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default AuthPrompt;
