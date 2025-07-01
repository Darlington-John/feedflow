import { FaEllipsisV } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { member_type } from "~/lib/types/member";
import { formatDate } from "~/lib/utils/format-date";

interface memberProps {
  member: member_type;
}
const MemberCard = ({ member }: memberProps) => {
  const roleColors: Record<string, string> = {
    "super admin": "bg-indigo-900  text-white",
    admin: "bg-[#2563EB]  text-white",
    member: "bg-[#14B8A6]  text-white",
  };

  return (
    <div className="flex flex-col gap-2 items-center p-2 border border-grey  rounded-md  w-[150px] py-5  relative  hover:shadow-2xl duration-150 hover:border-grey-blue  max-2xl:w-[200px]  max-md:w-full">
      <button className="w-6  h-6  absolute right-5 top-5  text-grey  flex items-center justify-center rounded-full hover:ring ring-grey-blue  duration-15o ">
        <FaEllipsisV className="text-grey-blue  text-sm " />
      </button>
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
        <h1 className="text-sm font-bold  text-white  line-clamp-1 capitalize text-center max-sm:font-light">
          {member.username}
        </h1>
        <h1
          className={`text-[11px] px-1  rounded-sm leading-none text-silver-blue sf-light ${
            roleColors[member.role as string]
          }`}
        >
          {member.role}
        </h1>
        <span className="text-center  text-silver-blue text-xs">
          Joined {formatDate(member.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default MemberCard;
