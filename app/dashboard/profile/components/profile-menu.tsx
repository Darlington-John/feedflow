import Image from "next/image";
import loadingGif from "~/public/images/esclipse.svg";
import { HiUserGroup } from "react-icons/hi2";
import { formatDate } from "~/lib/utils/format-date";
import { IoIosArrowForward } from "react-icons/io";
import { usePopup } from "~/lib/utils/toggle-popups";

import { useAuthContext } from "~/app/context/auth-context";
import EditName from "./edit-profile/edit-name-popup";
import EditIcon from "./edit-profile/edit-icon-popup";
import DeleteAccountPopup from "./delete-account-popup";

const ProfileMenu = () => {
  const { user, hasError, error, loading } = useAuthContext();

  const {
    isVisible: nameVisible,
    isActive: nameActive,
    ref: nameRef,
    togglePopup: toggleNamePopup,
    setDisableToggle: setDisableName,
  } = usePopup();
  const {
    isVisible: iconVisible,
    isActive: iconActive,
    ref: iconRef,
    togglePopup: toggleIconPopup,
    setDisableToggle: setDisableIcon,
  } = usePopup();
  const {
    isVisible: deleteAcctVisible,
    isActive: deleteAcctActive,
    ref: deleteAcctRef,
    togglePopup: toggleDeleteAcctPopup,
    setDisableToggle: setDisableDeleteAcct,
  } = usePopup();

  return (
    <>
      <div
        className={`shrink-0  p-5 bg-dark-navy top-0 sticky w-[310px]  rounded-xl flex flex-col  gap-4   max-2xl:order-first max-2xl:w-full max-2xl:flex-row max-2xl:items-start  max-2xl:static  max-sm:flex-col overflow-hidden  `}
      >
        {hasError ? (
          <div className="flex h-[200px] items-center justify-center ">
            <div className="flex flex-col gap-1">
              <p className=" text-xl text-white      spaced leading-none ">
                Oops! We ran into a server error.
              </p>
              <p className="text-sm  normal-case  tracking-normal text-silver-blue line-clamp-3">
                {error}
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="w-full h-32 items-center justify-center flex ">
            <Image className="w-6" src={loadingGif} alt="loading" />
          </div>
        ) : (
          <>
            <div className="flex flex-col  gap-4  max-2xl:flex-1 ">
              <div className="flex items-center gap-3 cursor-pointer  ">
                {user?.profile ? (
                  //  eslint-disable-next-line
                  <img
                    src={user?.profile}
                    className=" rounded-full object-cover  w-20  h-20  ring ring-grey"
                    alt=""
                  />
                ) : (
                  <div className="items-center justify-center  flex  rounded-full bg-grey w-20  h-20   ring ring-grey">
                    <HiUserGroup size={50} />
                  </div>
                )}
                <div className="flex flex-col text-silver-blue leading-none">
                  <h1 className="text-2xl sf-bold">{user?.username}</h1>
                  <h1 className="text-xs text-fade-blue text-start ">
                    • Joined {formatDate(user?.createdAt as string)}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-2xl:flex-1 ">
              <div className="flex flex-col gap-2 w-full max-2xl:flex-1 ">
                <button
                  className="w-full bg-navy  rounded-md  p-2 h-[45px]  flex items-center justify-between text-silver-blue text-sm hover:bg-grey duration-150 "
                  onClick={toggleNamePopup}
                >
                  <span>Edit Username</span>
                  <IoIosArrowForward />
                </button>
                <button
                  className="w-full bg-navy  rounded-md  p-2 h-[45px]  flex items-center justify-between text-silver-blue text-sm hover:bg-grey duration-150 "
                  onClick={toggleIconPopup}
                >
                  <span>Change Icon</span>
                  <IoIosArrowForward />
                </button>
                <button
                  className="w-full rounded-md  p-2 h-[45px]  flex items-center justify-between text-silver-blue text-sm  bg-[#09192678] duration-150 hover:bg-grey   "
                  onClick={toggleDeleteAcctPopup}
                >
                  <span>Delete account</span>
                  <IoIosArrowForward />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <EditName
        isVisible={nameVisible}
        isActive={nameActive}
        ref={nameRef}
        setDisable={setDisableName}
        togglePopup={toggleNamePopup}
      />

      <EditIcon
        isVisible={iconVisible}
        isActive={iconActive}
        ref={iconRef}
        togglePopup={toggleIconPopup}
        setDisable={setDisableIcon}
      />
      <DeleteAccountPopup
        isVisible={deleteAcctVisible}
        isActive={deleteAcctActive}
        ref={deleteAcctRef}
        togglePopup={toggleDeleteAcctPopup}
        setDisable={setDisableDeleteAcct}
      />
    </>
  );
};

export default ProfileMenu;
