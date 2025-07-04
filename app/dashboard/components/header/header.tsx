"use client";
import Image from "next/image";
import { useAuthContext } from "~/app/context/auth-context";
import { useUtilsContext } from "~/app/context/utils-context";
import { usePopup } from "~/lib/utils/toggle-popups";
import ProfileMenu from "./profile-menu";
import LogoutPrompt from "./logout-prompt";
import logo from "~/public/images/logo.svg";
import { toggleOverlay } from "~/lib/utils/toggle-overlay";
import { FaPlus } from "react-icons/fa6";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Header = () => {
  const { user, loading } = useAuthContext();
  const { toggleAuthPopup } = useUtilsContext();
  const {
    isVisible: isProfileMenuVisible,
    isActive: profileMenu,
    ref: profileMenuRef,
    togglePopup: toggleProfileMenu,
  } = usePopup();

  const {
    isVisible: isLogoutPromptVisible,
    isActive: logoutPrompt,
    ref: logoutPromptRef,
    togglePopup: toggleLogoutPrompt,
  } = usePopup();

  const { overlayOpen, setOverlayOpen } = useUtilsContext();

  const handleToggleOverlay = () => {
    toggleOverlay();
    setOverlayOpen(!overlayOpen);
  };
  const { toggleCreateTeamPopup } = useUtilsContext();
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between w-[calc(100vw-5px)]  px-4 py-2 bg-navy  border-b-grey border-b-2  fixed top-0   z-1000 max-sm:py-1  max-xs:px-2">
      <Link href="/" className="flex items-center  gap-1 ">
        <Image src={logo} alt="drlix_logo" className="w-10 max-sm:w-7" />
        <h1 className="text-3xl  sf-bold  text-white max-sm:text-2xl">
          feedflow
        </h1>
      </Link>

      <div className="flex items-center gap-0">
        {!loading &&
          (user ? (
            <>
              <button
                className="flex items-center gap-1  hover:bg-grey h-[35px] rounded-full px-2 text-sm  text-silver-blue  hover:text-white  duration-150 max-xs:hidden"
                onClick={toggleCreateTeamPopup}
              >
                <FaPlus />
                <span>New team</span>
              </button>

              <div className="relative">
                <button
                  className={`hover:bg-grey py-1  px-1  rounded-full ${
                    pathname.startsWith("/dashboard/profile") &&
                    "outline  outline-powder-blue"
                  }`}
                  onClick={toggleProfileMenu}
                >
                  {/* eslint-disable */}
                  <img
                    src={
                      user?.profile ? user.profile : "/icons/user-circle.svg"
                    }
                    className="w-8 h-8  rounded-full overflow-hidden  text-xl max-sm:w-7 text-xl max-sm:h-7"
                    alt="pointer"
                  />
                </button>
                <ProfileMenu
                  isProfileMenuVisible={isProfileMenuVisible}
                  profileMenu={profileMenu}
                  profileMenuRef={profileMenuRef}
                  toggleLogoutPrompt={toggleLogoutPrompt}
                />
                <LogoutPrompt
                  isLogoutPromptVisible={isLogoutPromptVisible}
                  logoutPrompt={logoutPrompt}
                  logoutPromptRef={logoutPromptRef}
                  togglePopup={toggleLogoutPrompt}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center px-2 ">
              <button
                className=" bg-powder-blue  hover:bg-[#0985bf]  px-3   rounded-full h-[35px]  max-w-sm:h-[30px] text-sm text-white duration-100 "
                onClick={toggleAuthPopup}
              >
                Sign in
              </button>
            </div>
          ))}
        {user && (
          <button
            className="bg-grey p-1  rounded-full  hidden max-md:flex"
            onClick={handleToggleOverlay}
          >
            {overlayOpen ? (
              <IoMdClose className="text-xl text-silver-blue " />
            ) : (
              <IoMdMenu className="text-xl text-silver-blue" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
