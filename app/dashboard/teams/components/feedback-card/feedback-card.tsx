import { MdBugReport, MdLightbulb } from "react-icons/md";
import { TiStarburst } from "react-icons/ti";
import { feedback_type } from "~/lib/types/feedback";
import { formatRelativeTime } from "~/lib/utils/relative-time";
import EditorViewer from "../../../components/text-editor/viewer";
import { usePopup } from "~/lib/utils/toggle-popups";
import MarkFeedback from "./mark-popup";
import { FaCircleUser } from "react-icons/fa6";
import ReactionBar from "./reaction-bar";
import { FaCheck, FaCircle, FaEllipsisH } from "react-icons/fa";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import { useState } from "react";
import { useAuthContext } from "~/app/context/auth-context";
import { apiRequest } from "~/lib/utils/api-request";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/lib/redux/store";
import { deleteFeedback } from "~/lib/redux/slices/feedbacks";

interface props {
  feed: feedback_type;
  setFeedbackCount: React.Dispatch<React.SetStateAction<number>>;
}
const FeedbackCard = ({ feed, setFeedbackCount }: props) => {
  const { user } = useAuthContext();
  const { team_id } = useParams();

  const types = [
    {
      type: "bug",
      icon: <MdBugReport className="text-white" size={14} />,
    },
    {
      type: "idea",
      icon: <MdLightbulb className="text-white " size={14} />,
    },
    {
      type: "feature",
      icon: <TiStarburst className="text-white" size={14} />,
    },
  ];
  const selected = types.find((t) => t.type === feed.type);
  const bgOnType =
    selected?.type === "bug"
      ? "bg-[#B22222]"
      : selected?.type === "idea"
      ? "bg-[#DAA520]"
      : "bg-[#007BA7]";
  const roleColors: Record<string, string> = {
    "super admin": "bg-[#783a71]  text-white",
    admin: "bg-[#2563EB]  text-white",
    member: "bg-[#14B8A6]  text-white",
  };

  const {
    isActive: markOpen,
    isVisible: markVisible,
    ref: markRef,
    togglePopup: toggleMarkOpen,
    setDisableToggle: setDisableMark,
  } = usePopup();

  const {
    isActive: deleteOpen,
    isVisible: deleteVisible,
    ref: deleteRef,
    togglePopup: toggleDeleteOpen,
    setDisableToggle: setDisableDelete,
  } = usePopup();
  const dispatch = useDispatch<AppDispatch>();
  const [deleting, setDeleting] = useState(false);
  const [sucessful, setSucessful] = useState(false);
  const handleDeleteFeedback = async () => {
    if (deleting) {
      return;
    }
    if (!user) {
      return;
    }
    setDeleting(true);
    setDisableDelete(true);
    await apiRequest({
      url: `/api/teams/${team_id}/delete-feedback`,
      method: "DELETE",
      body: { userId: user?._id, feedId: feed?._id },
      onSuccess: (res) => {
        setSucessful(true);
        toast.success(res.message, {
          icon: <FaCheck color="white" />,
        });

        setTimeout(() => {
          toggleDeleteOpen();
          setSucessful(false);
          dispatch(deleteFeedback({ feedbackId: feed._id }));
          setFeedbackCount((prev) => prev - 1);
        }, 3000);
      },
      onError: (error) => {
        toast.error(error);
      },
      onFinally: () => {
        setDisableDelete(false);
        setDeleting(false);
      },
    });
  };

  return (
    <div
      className="flex flex-col gap-2 w-full items-start bg-[#01081229]  p-4  rounded-xl  relative z-20 "
      key={feed._id}
    >
      <div className="w-full justify-between  flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          {feed.by?.profile ? (
            //  eslint-disable-next-line
            <img
              src={feed.by.profile}
              className=" rounded-full object-cover  w-10  h-10  ring ring-grey"
              alt=""
            />
          ) : (
            <div className="items-center justify-center  flex  rounded-full bg-grey w-10  h-10   ring ring-grey">
              <FaCircleUser className="text-2xl" />
            </div>
          )}
          <div className="flex flex-col items-start  gap-1">
            <div className="text-silver-blue text-[14px] leading-none flex items-baseline  gap-1 flex-row">
              <span>{feed.by.username}</span>
              <FaCircle size={4} className="self-center" />{" "}
              <span className="text-[11px] text-silver-blue sf-light">
                {formatRelativeTime(feed.createdAt)}
              </span>
            </div>
            <span
              className={`text-[11px] px-1  rounded-sm leading-none text-silver-blue sf-light  ${
                roleColors[feed.by.role as string]
              }`}
            >
              {feed.by.role}
            </span>
          </div>
        </div>
        {(feed.adminIds?.includes(user?._id as string) ||
          feed.superAdminIds?.includes(user?._id as string) ||
          feed.by._id === user?._id) && (
          <div className="relative">
            <button
              className="flex items-center justify-center  p-1 hover:bg-grey rounded-full duration-150"
              onClick={toggleDeleteOpen}
            >
              <FaEllipsisH size={12} />
            </button>
            {deleteOpen && (
              <div
                className={`w-[120px]     mid-popup   duration-150  flex flex-col rounded-lg bg-navy   items-center  rounded-full absolute  top-[100%]  right-0   shadow-xl z-10 border border-grey  ${
                  deleteVisible ? "" : "mid-popup-hidden"
                }`}
                ref={deleteRef}
              >
                <AsyncButton
                  action="Delete feedback"
                  classname_overide="!h-8 !rounded-sm !bg-grey"
                  loading={deleting}
                  success={sucessful}
                  onClick={handleDeleteFeedback}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`flex items-center   px-1   py-1 text-left  rounded-full   ${bgOnType}`}
      >
        <span className="">{selected?.icon}</span>
        <span className="capitalize text-xs text-white  leading-none">
          {selected?.type}
        </span>
      </div>
      <div className="flex flex-col  pt-3 gap-2">
        <h1 className="text-lg text-white leading-none  ">{feed.title}</h1>
        <EditorViewer
          content={feed.details}
          className="!text-xs  !text-silver-blue editor"
        />
      </div>
      <ReactionBar feed={feed} toggleMarkOpen={toggleMarkOpen} />
      <MarkFeedback
        isActive={markOpen}
        isVisible={markVisible}
        ref={markRef}
        togglePopup={toggleMarkOpen}
        setDisable={setDisableMark}
        feed={feed}
      />
    </div>
  );
};

export default FeedbackCard;
