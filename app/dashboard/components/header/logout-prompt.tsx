import Image from "next/image";
import { useState } from "react";
import { apiRequest } from "~/lib/utils/api-request";
import waving from "~/public/images/waving-hand-svgrepo-com.svg";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import AsyncButton from "../buttons/async-button";
interface promptProp {
  isLogoutPromptVisible: boolean;
  logoutPrompt: boolean;
  logoutPromptRef: React.RefObject<HTMLDivElement | null>;
  togglePopup: () => void;
}
const LogoutPrompt = ({
  isLogoutPromptVisible,
  logoutPrompt,
  logoutPromptRef,
  togglePopup,
}: promptProp) => {
  const [clearing, setClearing] = useState(false);
  const [sucessful, setSucessful] = useState(false);
  const [error, setError] = useState("");

  const clearCookies = async () => {
    setClearing(true);
    setError("");
    apiRequest({
      url: "/api/auth/clear-cookies",
      method: "POST",
      onSuccess: () => {
        window.dispatchEvent(new CustomEvent("userUpdated"));

        toast.success("Log out successful", {
          icon: <FaCheck color="white" />,
        });
        setSucessful(true);
        setTimeout(() => togglePopup(), 2000);
        setTimeout(() => setSucessful(false), 3000);
      },
      onError: () => {
        setError("An error occured");
      },
      onFinally: () => {
        setClearing(false);
      },
    });
    try {
      const response = await fetch("/api/clear-cookies", {
        method: "POST",
        credentials: "include",
      });
      setClearing(true);
      if (!response.ok) {
      }
    } catch (error) {
      console.error("Error clearing cookies:", error);
    }
  };
  return (
    logoutPrompt && (
      <div
        className={`fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
      >
        <div
          className={`w-[300px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-navy   items-center      ${
            isLogoutPromptVisible ? "" : "mid-popup-hidden"
          }`}
          ref={logoutPromptRef}
        >
          <div className="flex flex-col  items-center">
            <Image src={waving} className="w-20" alt="" />
            <div className="flex flex-col gap-2">
              <h1 className="text-[27px]     text-center text-white">
                See you soon
              </h1>
              <p className="text-sm sf-light  text-center text-light-blue">
                You are about to logout.
                <br />
                Are you sure that&apos;s what you want?
              </p>
            </div>
          </div>
          {error && <h1 className="text-sm text-red  text-center">{error}</h1>}
          <div className="flex items-center gap-2  w-full">
            <AsyncButton
              onClick={clearCookies}
              action="Confirm logout"
              classname_overide="h-[40px] hover:ring  hover:ring-powder-blue  hover:ring-offset-1   text-sm duration-300  rounded-md"
              loading={clearing}
              disabled={clearing}
              success={sucessful}
            />

            <button
              onClick={() => {
                togglePopup();
              }}
              className="bg-grey   text-white px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300  gap-1 sf-light   text-xs w-[40%] "
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default LogoutPrompt;
