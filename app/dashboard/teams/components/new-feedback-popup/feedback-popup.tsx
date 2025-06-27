"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import type { JSONContent } from "@tiptap/react";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import ClassicInput from "~/app/dashboard/components/inputs/classic-inputs";
import { useAuthContext } from "~/app/context/auth-context";
import { useUtilsContext } from "~/app/context/utils-context";
import { apiRequest } from "~/lib/utils/api-request";
import { FaLightbulb } from "react-icons/fa6";
import { FaBug, FaChevronDown } from "react-icons/fa";
import { usePopup } from "~/lib/utils/toggle-popups";
import { TiStarburst } from "react-icons/ti";
import PriorityRating from "./priority";
import TextEditor from "~/app/dashboard/components/text-editor/text-editor";

interface props {
  newFeedbackPopup: boolean;
  newFeedbackPopupVisible: boolean;
  newFeedbackPopupRef: React.RefObject<HTMLDivElement | null>;
  toggleNewFeedbackPopup: () => void;
  disableNewFeedbackPopup: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewFeedbackPopup = ({
  newFeedbackPopup,
  newFeedbackPopupVisible,
  newFeedbackPopupRef,
  toggleNewFeedbackPopup,
  disableNewFeedbackPopup,
}: props) => {
  const { user } = useAuthContext();
  const { toggleAuthPopup } = useUtilsContext();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [sucessful, setSucessful] = useState(false);

  const { team_id } = useParams();

  const [type, setType] = useState("bug");

  const types = [
    {
      type: "bug",
      icon: <FaBug className="text-[#BE185D]" />,
    },
    {
      type: "idea",
      icon: <FaLightbulb className="text-[#FFD700]" />,
    },
    {
      type: "feature",
      icon: <TiStarburst className="text-powder-blue" />,
    },
  ];
  const selected = types.find((t) => t.type === type);

  const {
    isActive: typeOpen,
    isVisible: typeVisible,
    ref: typeRef,
    togglePopup: toggleTypeOpen,
  } = usePopup();

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState<JSONContent | null>(null);
  const [priority, setPriority] = useState(3);

  const hasValidContent = (nodes: JSONContent[]): boolean => {
    return nodes?.some((node) => {
      if (node.type === "image") return true;

      if (node.type === "text" && node.text?.trim() !== "") return true;
      if (node.content) {
        return hasValidContent(node.content);
      }

      return false;
    });
  };
  const createFeedback = async () => {
    if (!user) {
      toggleAuthPopup();
      return;
    }
    if (creating) {
      return;
    }
    if (title.trim() === "") {
      setError("A short title is required");
      return;
    }
    if (!hasValidContent(details?.content || [])) {
      setError("Details must contain text or an image");
      return;
    }
    setCreating(true);
    setError("");
    disableNewFeedbackPopup(true);
    await apiRequest({
      url: `/api/teams/${team_id}/create-feedback`,
      method: "POST",
      body: {
        title,
        type,
        userId: user._id,
        details,
        priority,
      },
      onSuccess: (res) => {
        setSucessful(true);
        window.dispatchEvent(new CustomEvent("refreshFeedbacks"));
        toast.success(res.message);
        setTimeout(() => {
          toggleNewFeedbackPopup();
          setTitle("");
          setDetails(null);
          setSucessful(false);
        }, 1500);
      },
      onError: (error) => {
        setError(error);
      },
      onFinally: () => {
        disableNewFeedbackPopup(false);
        setCreating(false);
      },
    });
  };

  return (
    newFeedbackPopup && (
      <div
        className={`fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
      >
        <div
          className={`w-[700px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-6   rounded-lg rounded-lg bg-fade-grey         ${
            newFeedbackPopupVisible ? "" : "mid-popup-hidden"
          }`}
          ref={newFeedbackPopupRef}
        >
          <h1 className="text-2xl sf-bold text-white text-start">
            Give feedback
          </h1>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-2 w-full ">
              <div className="relative">
                <button
                  className="flex w-[120px] focus:ring-[1px]    ring-fade-blue   rounded-full h-11 overflow-hidden duration-150 border border-grey"
                  onClick={toggleTypeOpen}
                >
                  <div className="flex items-center gap-1 w-full  flex  items-center justify-center">
                    {selected?.icon}
                    <span className="text-sm text-silver-blue sf-bold">
                      {selected?.type}
                    </span>
                  </div>
                  <div className="w-[40px] bg-grey flex  items-center justify-center shrink-0">
                    <FaChevronDown size={14} />
                  </div>
                </button>
                {typeOpen && (
                  <div
                    className={`w-[120px]     mid-popup   duration-150  flex flex-col rounded-lg bg-navy   items-center  rounded-full absolute  top-[100%]  left-0  overflow-hidden shadow-xl z-10 border border-grey  ${
                      typeVisible ? "" : "mid-popup-hidden"
                    }`}
                    ref={typeRef}
                  >
                    {types.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => {
                          setType(item.type);
                          toggleTypeOpen();
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left  ${
                          selected?.type === item.type
                            ? "bg-grey"
                            : "hover:bg-fade-grey"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="capitalize text-sm text-silver-blue  ">
                          {item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <ClassicInput
                value={title}
                setValue={setTitle}
                setError={setError}
                classname_overide="rounded-full"
                error={error}
                errorContent="A short title is required"
                placeholder="Short title for your feedback"
              />
            </div>
            <TextEditor
              onContentChange={(json) => {
                setDetails(json);
                setError("");
              }}
            />
            <div className="flex items-center gap-2">
              <PriorityRating
                value={priority}
                setValue={setPriority}
                size={20}
              />
            </div>
          </div>
          {error && (
            <h1 className="text-[11px] neue-light text-red text-center">
              {error}
            </h1>
          )}

          <div className="flex gap-4 justify-between">
            <button
              className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-full  bg-grey-blue        duration-150 hover:ring hover:ring   ring-white         text-center w-32  text-white text-sm "
              onClick={toggleNewFeedbackPopup}
            >
              Cancel
            </button>
            <AsyncButton
              loading={creating}
              success={sucessful}
              action="Create"
              onClick={createFeedback}
              disabled={
                creating ||
                title.trim() === "" ||
                !hasValidContent(details?.content || [])
              }
              classname_overide=" max-h-[40px] hover:ring  rounded-full  !w-32"
            />
          </div>
        </div>
      </div>
    )
  );
};

export default NewFeedbackPopup;
