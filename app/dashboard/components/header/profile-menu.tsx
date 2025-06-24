import { useAuthContext } from "~/app/context/auth-context";
import { User } from "~/lib/types/user-type";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { FaGear } from "react-icons/fa6";
interface menuProps {
  isProfileMenuVisible: boolean;
  profileMenu: boolean;
  profileMenuRef: React.RefObject<HTMLDivElement | null>;

  toggleLogoutPrompt: () => void;
}

const ProfileMenu = ({
  isProfileMenuVisible,
  profileMenu,
  profileMenuRef,
  toggleLogoutPrompt,
}: menuProps) => {
  const { user } = useAuthContext() as { user: User };
  return (
    profileMenu && (
      <div
        className={`w-[200px]        py-4 px-2  flex flex-col gap-1       duration-300 absolute top-12 right-0  bg-fade-grey  shadow-lg  rounded-lg border border-grey   ${
          isProfileMenuVisible ? "opacity-100" : "opacity-0"
        }`}
        ref={profileMenuRef}
      >
        <div className="flex flex-col w-full gap-1">
          <Link
            href={`/users/${user._id}?query=posts`}
            className="flex  items-center gap-3 py-2 hover:bg-grey px-2 rounded-sm"
          >
            {/* eslint-disable-next-line */}
            <img
              src={user?.profile ? user.profile : "/icons/user-circle.svg"}
              className="w-8  h-8 object-cover rounded-full cursor-pointer "
              alt=""
            />
            <h1 className="text-[15px]   leading-[24px] line-clamp-1   sf-light text-white">
              View Profile
            </h1>
          </Link>
        </div>
        <div className="flex flex-col w-full gap-1  hover:bg-grey rounded-sm">
          <div className="flex  items-center gap-3 py-2 px-3">
            <FaGear className="w-5  object-cover cursor-pointer " />
            <h1 className="text-[15px]   leading-[24px] line-clamp-1  sf-light  text-white">
              Settings
            </h1>
          </div>
        </div>

        <div className="flex flex-col w-full gap-1  hover:bg-grey rounded-sm">
          <button
            className="flex  items-center gap-3 py-2 px-3"
            onClick={toggleLogoutPrompt}
          >
            <CiLogout className="w-5  object-cover   cursor-pointer " />
            <h1 className="text-[15px]   leading-[24px] line-clamp-1   sf-light  text-white">
              Log out
            </h1>
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileMenu;
