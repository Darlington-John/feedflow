import { useParams } from "next/navigation";
import { useState } from "react";
import { FaCheck, FaChevronDown, FaCircleUser } from "react-icons/fa6";
import { GoGear } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuthContext } from "~/app/context/auth-context";
import { useUtilsContext } from "~/app/context/utils-context";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import { feedback_type } from "~/lib/types/feedback";
import { apiRequest } from "~/lib/utils/api-request";
import { formatRelativeTime } from "~/lib/utils/relative-time";
import { usePopup } from "~/lib/utils/toggle-popups";

interface Props {
  isVisible: boolean;
  isActive: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  togglePopup: () => void;
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
  feed: feedback_type;
}
const MarkFeedback = ({
  isActive,
  isVisible,
  ref,
  togglePopup,
  setDisable,
  feed,
}: Props) => {
  const { user } = useAuthContext();
  const { toggleAuthPopup } = useUtilsContext();
  const { team_id } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const mark = async () => {
    if (!user) {
      toggleAuthPopup();
      return;
    }
    if (loading) {
      return;
    }
    if (!status) {
      setError("Pick a status");
      return;
    }
    setLoading(true);
    setError("");
    setDisable(true);

    await apiRequest({
      url: `/api/teams/${team_id}/mark-feedback`,
      method: "PATCH",
      body: { userId: user._id, feedId: feed._id, status },
      onSuccess: (response) => {
        setSuccessful(true);
        toast.success(response.message, {
          icon: <FaCheck color="white" />,
        });

        setTimeout(() => {
          togglePopup();
          setSuccessful(false);
          window.dispatchEvent(new CustomEvent("refreshFeedbacks"));
        }, 3000);
      },
      onError: (error) => {
        setError(error);
      },
      onFinally: () => {
        setLoading(false);
        setDisable(false);
      },
    });
  };
  const [status, setStatus] = useState("");

  const statuses = [
    {
      type: "under review",
      icon: <IoSearch className="text-powder-blue" />,
    },
    {
      type: "in progress",
      icon: <GoGear className="text-[#FDBA74]" />,
    },
    {
      type: "completed",
      icon: <FaCheck className="text-[#86EFAC]" />,
    },
    {
      type: "declined",
      icon: <IoMdClose className="text-[#FCA5A5]" />,
    },
  ];
  const selected = statuses.find((t) => t.type === status);
  const {
    isActive: statusOpen,
    isVisible: statusVisible,
    ref: statusRef,
    togglePopup: toggleStatusOpen,
  } = usePopup();

  return (
    isActive && (
      <div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
        <div
          className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg rounded-lg bg-fade-grey   items-center      ${
            isVisible ? "" : "mid-popup-hidden"
          }`}
          ref={ref}
        >
          <div className="flex items-center flex-col gap-0 w-full leading-none">
            <h1 className="text-2xl sf-bold text-center text-white">
              {feed?.status?.type ? "Remark Feedback" : "Mark Feedback"}
            </h1>
            {feed?.status?.type ? (
              <div className="flex flex-col gap-1 items-center">
                <p className="text-grey-blue text-center text-sm ">
                  This feedback was already marked by
                </p>
                <div className="flex items-center gap-1">
                  {feed?.status?.marked_by?.profile ? (
                    //  eslint-disable-next-line
                    <img
                      src={feed?.status?.marked_by?.profile}
                      className=" rounded-full object-cover  w-10  h-10  ring ring-grey"
                      alt=""
                    />
                  ) : (
                    <div className="items-center justify-center  flex  rounded-full bg-grey w-10  h-10   ring ring-grey">
                      <FaCircleUser size={50} />
                    </div>
                  )}
                  <div className="flex flex-col ">
                    <span className="text-white   text-sm ">
                      {feed?.status?.marked_by?.username}
                    </span>
                    <span className="text-grey-blue  text-xs ">
                      {formatRelativeTime(feed?.status?.marked_at)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-grey-blue text-center text-sm ">
                Mark feedback as either &apos;under review&apos; ,&apos;in
                progress&apos;, &apos;completed&apos;, &apos;declined&apos;
              </p>
            )}
          </div>
          <div className="relative">
            <button
              className="flex w-[160px] focus:ring-[1px]    ring-fade-blue   rounded-full h-11 overflow-hidden duration-150 border border-grey"
              onClick={toggleStatusOpen}
            >
              <div className="flex items-center gap-1 w-full  flex  i justify-center">
                <span>{selected?.icon}</span>
                <span className="text-sm text-silver-blue sf-bold  leading-0">
                  {selected?.type}
                </span>
              </div>
              <div className="w-[40px] bg-grey flex  items-center justify-center shrink-0">
                <FaChevronDown size={14} />
              </div>
            </button>
            {statusOpen && (
              <div
                className={`w-[160px]     mid-popup   duration-150  flex flex-col rounded-lg bg-navy   items-center  rounded-full absolute  top-[100%]  left-0  overflow-hidden shadow-xl z-10 border border-grey  ${
                  statusVisible ? "" : "mid-popup-hidden"
                }`}
                ref={statusRef}
              >
                {statuses.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      setStatus(item.type);
                      toggleStatusOpen();
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

          {error && (
            <h1 className="text-[11px] neue-light text-red text-center">
              {error}
            </h1>
          )}

          <div className="gap-2 flex w-full">
            <button
              className="bg-grey text-center w-full  hover:outline outline-light-grey   !rounded-md text-sm"
              onClick={togglePopup}
              disabled={loading}
            >
              Cancel
            </button>
            {feed?.status?.type ? (
              <AsyncButton
                classname_overide="!h-[40px] !rounded-md"
                action="Remark"
                disabled={!status || loading}
                loading={loading}
                success={successful}
                onClick={mark}
              />
            ) : (
              <AsyncButton
                classname_overide="!h-[40px] !rounded-md"
                action="Mark"
                disabled={!status || loading}
                loading={loading}
                success={successful}
                onClick={mark}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MarkFeedback;
