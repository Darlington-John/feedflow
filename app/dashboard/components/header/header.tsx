"use client";
import Image from "next/image";
import { useAuthContext } from "~/app/context/auth-context";
import { useUtilsContext } from "~/app/context/utils-context";
import { usePopup } from "~/lib/utils/toggle-popups";
import ProfileMenu from "./profile-menu";
import LogoutPrompt from "./logout-prompt";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import logo from "~/public/images/logo.svg";
const Header = () => {
  const { user } = useAuthContext();
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
  return (
    <header className="flex items-center justify-between w-[calc(100vw-5px)]  px-4 py-2 bg-navy  border-b-grey border-b-2  fixed top-0   z-1000">
      <div className="flex items-center  gap-1 ">
        <Image src={logo} alt="drlix_logo" className="w-10" />
        <h1 className="text-3xl  sf-bold  text-white">feedflow</h1>
      </div>
      <div className="flex items-center justify-center h-10 rounded-full  relative">
        <FaSearch className="w-5 absolute  pointer-events-none left-4 text-silver-blue " />
        <input
          className="w-[550px]  h-10  bg-grey  pl-10  text-sm  sf-light  focus:ring-2 ring-white  rounded-full text-white"
          type="text "
          placeholder="Search feedflow"
        />
      </div>
      <div className="flex items-center gap-0">
        {user ? (
          <>
            <button className="flex items-center gap-1  hover:bg-grey py-2 px-3 rounded-full ">
              <FaPlus className="text-silver-blue" size={20} />
              <h1 className="text-sm  text-light-blue">Give feedback</h1>
            </button>
            <button className="hover:bg-grey py-2 px-2 rounded-full ">
              <FaRegBell className=" text-silver-blue" size={20} />
            </button>
            <div className="relative">
              <button
                className="hover:bg-grey py-1  px-1  rounded-full "
                onClick={toggleProfileMenu}
              >
                {/* eslint-disable */}
                <img
                  src={user?.profile ? user.profile : "/icons/user-circle.svg"}
                  className="w-8 h-8  rounded-full overflow-hidden "
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
          <div className="flex items-center">
            <button
              className=" bg-powder-blue  hover:bg-[#0985bf]  px-4   rounded-full h-[40px] text-sm text-white duration-100 "
              onClick={toggleAuthPopup}
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
