import { FaEllipsisV } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { member_type } from "~/lib/types/member";
import { formatDate } from "~/lib/utils/format-date";
import { usePopup } from "~/lib/utils/toggle-popups";
import MemberMenu from "./member-menu";
import { useAuthContext } from "~/app/context/auth-context";

interface memberProps {
  member: member_type;
}
const MemberCard = ({ member }: memberProps) => {
  const roleColors: Record<string, string> = {
    "super admin": "bg-[#783a71]  text-white",
    admin: "bg-[#2563EB]  text-white",
    member: "bg-[#14B8A6]  text-white",
  };
  const {
    isActive: memberMenu,
    isVisible: memberMenuVisible,
    ref: memberMenuRef,
    setDisableToggle: disableToggle,
    togglePopup: toggleMemberMenu,
  } = usePopup();

  const { user } = useAuthContext();
  return (
    <div className="flex flex-col gap-2 items-center  border border-grey  rounded-sm overflow-hidden  w-[150px] py-5  relative  hover:shadow-2xl duration-150 hover:border-grey-blue  max-2xl:w-[200px]  relative  max-2xs:w-full">
      {!member.superAdminIds?.includes(member._id) &&
        member._id !== user?._id &&
        (member.adminIds?.includes(user?._id as string) ||
          member.superAdminIds?.includes(user?._id as string)) && (
          <button
            className="w-5  h-5  absolute right-3 top-3  text-grey  flex items-center justify-center rounded-full hover:ring ring-grey-blue  duration-15o "
            onClick={toggleMemberMenu}
          >
            <FaEllipsisV className="text-grey-blue  text-xs " />
          </button>
        )}

      {member.profile ? (
        //  eslint-disable-next-line
        <img
          src={member?.profile}
          className=" rounded-full object-cover  w-26  h-26  max-2xs:w-20  max-2xs:h-20"
          alt=""
        />
      ) : (
        <div className="items-center justify-center  flex  rounded-full bg-grey  w-26  h-26  max-2xs:w-20  max-2xs:h-20 ">
          <HiUserGroup size={50} />
        </div>
      )}
      <div className="flex w-full items-center  flex-col">
        <h1 className="text-sm   text-white  line-clamp-1 capitalize text-center max-sm:font-light  line-clamp-1">
          {member.username}
        </h1>
        <span
          className={`text-[11px] px-1   leading-none text-silver-blue sf-light w-full text-center  absolute bottom-0 ${
            roleColors[member.role as string]
          }`}
        >
          {member.role}
        </span>
        <span className="text-center  text-silver-blue text-xs">
          Joined {formatDate(member.createdAt)}
        </span>
        <span className="text-center  text-silver-blue text-[11px] sf-light">
          {member?.feedbacks_count} feedback{member?.feedbacks_count > 1 && "s"}
        </span>
      </div>
      <MemberMenu
        member={member}
        active={memberMenu}
        visible={memberMenuVisible}
        ref={memberMenuRef}
        toggleMenu={toggleMemberMenu}
        disableToggle={disableToggle}
      />
    </div>
  );
};

export default MemberCard;
