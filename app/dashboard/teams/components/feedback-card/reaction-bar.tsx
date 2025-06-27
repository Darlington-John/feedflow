import { useUtilsContext } from "~/app/context/utils-context";
import { FaCheck, FaChevronDown, FaStar } from "react-icons/fa6";
import { PiArrowFatDown, PiArrowFatUp } from "react-icons/pi";
import { apiRequest } from "~/lib/utils/api-request";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { GoGear } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { feedback_type } from "~/lib/types/feedback";
import { useAuthContext } from "~/app/context/auth-context";
import { useState } from "react";
interface props {
  feed: feedback_type;
  toggleMarkOpen: () => void;
}
const ReactionBar = ({ feed, toggleMarkOpen }: props) => {
  const { user } = useAuthContext();
  const { toggleAuthPopup } = useUtilsContext();
  const saveReaction = async (action: "like" | "dislike") => {
    if (!action) {
      return;
    }
    if (!feed._id || !user?._id) {
      return;
    }

    await apiRequest({
      url: action === "like" ? "/api/post/like" : "/api/post/dislike",
      method: "PATCH",
      body: {
        postId: feed._id,
        userId: user?._id,
      },
      onSuccess: (response) => {
        setLikes(response.likes);
        setDislikes(response.dislikes);
        toast.success(action === "like" ? "Post Liked" : "Post Disliked");
      },
      onError: () => {
        toast.error(action === "like" ? "Post not liked" : "Post not disliked");
      },
    });
  };

  const handleLike = () => {
    if (!user) {
      toggleAuthPopup();
      return;
    }
    saveReaction("like");
    if (userReaction === "like") {
      setLikes((prev) => prev - 1);
      setUserReaction("");
    } else {
      if (userReaction === "dislike") setDislikes((prev) => prev - 1);
      setLikes((prev) => prev + 1);
      setUserReaction("like");
    }
  };

  const handleDislike = () => {
    if (!user) {
      toggleAuthPopup();
      return;
    }
    saveReaction("dislike");
    if (userReaction === "dislike") {
      setDislikes((prev) => prev - 1);
      setUserReaction("");
    } else {
      if (userReaction === "like") setLikes((prev) => prev - 1);
      setDislikes((prev) => prev + 1);
      setUserReaction("dislike");
    }
  };

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
  const selectedStatus = statuses.find((t) => t.type === feed?.status?.type);

  const [likes, setLikes] = useState(feed.likes.length || 0);
  const [dislikes, setDislikes] = useState(feed.dislikes.length || 0);

  const [userReaction, setUserReaction] = useState<"like" | "dislike" | "">(
    feed.likes.includes(user?._id as string)
      ? "like"
      : feed.dislikes.includes(user?._id as string)
      ? "dislike"
      : ""
  );

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <button
          className={`px-3   flex  items-center  h-[30px]   gap-1 text-white    sf-light  rounded-full hover:outline  hover:outline-silver-blue  ${
            userReaction === "like" ? " bg-powder-blue" : "bg-[#0D273E]"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLike();
          }}
        >
          <PiArrowFatUp size={17} />
          <span className="leading-none text-xs">{likes}</span>
        </button>
        <button
          className={`px-3   flex  items-center  h-[30px]   gap-1 text-white bg-[#0D273E]   sf-light  rounded-full hover:outline  hover:outline-silver-blue  ${
            userReaction === "dislike" ? " bg-red " : "bg-[#0D273E]"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDislike();
          }}
        >
          <PiArrowFatDown size={17} />
          <span className="leading-none text-xs">{dislikes}</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 ring-fade-blue   rounded-full h-8 border border-grey flex items-center px-2 text-silver-blue">
          <span className="text-sm">Priority:</span>

          <button className="focus:outline-none flex text-sm  items-center ">
            <span>{feed.priority}</span>
            <FaStar size={14} className="text-powder-blue" />
          </button>
        </div>
        {feed?.status?.type ? (
          <button
            className="flex w-[160px] focus:ring-[1px]    ring-fade-blue   rounded-full h-8 overflow-hidden duration-150 border border-grey"
            onClick={toggleMarkOpen}
          >
            <div className="flex items-center gap-1 w-full  flex  items-center justify-center">
              <span>{selectedStatus?.icon}</span>
              <span className="text-sm text-silver-blue sf-bold  leading-0">
                {selectedStatus?.type}
              </span>
            </div>
            <div className="w-[40px] bg-grey flex  items-center justify-center shrink-0">
              <FaChevronDown size={14} />
            </div>
          </button>
        ) : (
          <button
            className="px-3   flex  items-center  h-[30px]   gap-1 text-white bg-[#0D273E]   sf-light  rounded-full  hover:outline  hover:outline-silver-blue text-xs"
            onClick={toggleMarkOpen}
          >
            <span>mark as</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReactionBar;
