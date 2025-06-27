import Image from "next/image";
import loadingGif from "~/public/images/esclipse.svg";
import { team_type } from "~/lib/types/team";
import { usePageFetch } from "~/lib/utils/fetch-page-data";
import { useParams } from "next/navigation";
import { HiUserGroup } from "react-icons/hi2";
import { formatDate } from "~/lib/utils/format-date";
import { IoIosArrowForward } from "react-icons/io";
import { usePopup } from "~/lib/utils/toggle-popups";
import EditName from "./edit-team/edit-name";
import EditIcon from "./edit-team/edit-icon";
import { useAuthContext } from "~/app/context/auth-context";
import EditDesc from "./edit-team/edit-desc";
import AddMembersPopup from "./add-members-popup";

const TeamMenu = () => {
  const { team_id } = useParams();
  const { user } = useAuthContext();
  const {
    fetchedData: team,
    isFetching,
    hasError,
    error,
  } = usePageFetch<team_type>({
    basePath: `/api/teams/${team_id}`,
    eventKey: "refetchTeam",
    dep: user,
  });
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
    isVisible: changeDescVisible,
    isActive: changeDescActive,
    ref: changeDescRef,
    togglePopup: toggleChangeDescPopup,
    setDisableToggle: setDisableChangeDesc,
  } = usePopup();
  const {
    isVisible: addMembersVisible,
    isActive: addMembersActive,
    ref: addMembersRef,
    togglePopup: toggleAddMembersPopup,
    setDisableToggle: setDisableAddMembers,
  } = usePopup();
  return (
    <>
      <div className="shrink-0  p-5 bg-dark-navy top-0 sticky w-[310px]  rounded-xl flex flex-col  gap-4 ">
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
        ) : isFetching ? (
          <div className="w-full h-32 items-center justify-center flex ">
            <Image className="w-6" src={loadingGif} alt="loading" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 cursor-pointer">
              {team?.icon ? (
                //  eslint-disable-next-line
                <img
                  src={team?.icon}
                  className=" rounded-full object-cover  w-20  h-20  ring ring-grey"
                  alt=""
                />
              ) : (
                <div className="items-center justify-center  flex  rounded-full bg-grey w-20  h-20   ring ring-grey">
                  <HiUserGroup size={50} />
                </div>
              )}
              <div className="flex flex-col text-silver-blue leading-none">
                <h1 className="text-2xl sf-bold">{team?.name}</h1>
                {team?.members && (
                  <h1 className="text-sm">
                    {team?.members.length}{" "}
                    {team?.members.length > 1 ? "members" : "member"}
                  </h1>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 ">
              {team?.description && (
                <h1 className="text-[13px] text-silver-blue  text-start sf-light">
                  {team.description}
                </h1>
              )}

              <h1 className="text-xs text-fade-blue text-start ">
                • Created {formatDate(team?.createdAt as string)}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col  gap-1">
                <span className="text-white text-sm">
                  {team?.super_admins.length ?? 0}
                </span>
                <h1 className="text-silver-blue leading-none  text-xs">
                  Super admins
                </h1>
              </div>
              <div className="flex flex-col  gap-1">
                <span className="text-white text-sm ">
                  {team?.admins.length ?? 0}
                </span>
                <h1 className="text-silver-blue leading-none text-xs">
                  Admins
                </h1>
              </div>
            </div>

            {team?.admins.includes(user?._id as string) ||
              (team?.super_admins.includes(user?._id as string) && (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    className="w-full bg-navy  rounded-md  p-2 h-[45px]  flex items-center justify-between text-silver-blue text-sm hover:bg-grey duration-150 "
                    onClick={toggleNamePopup}
                  >
                    <span>Edit Team Name</span>
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
                    className="w-full bg-navy  rounded-md  p-2 h-[45px]  flex items-center justify-between text-silver-blue text-sm hover:bg-grey duration-150 "
                    onClick={toggleChangeDescPopup}
                  >
                    <span>
                      {team?.description
                        ? "Edit  Description"
                        : "Add Description"}
                    </span>
                    <IoIosArrowForward />
                  </button>
                  <button
                    className="w-full bg-navy  rounded-md  p-2 h-[45px]  flex items-center justify-between text-silver-blue text-sm hover:bg-grey duration-150 "
                    onClick={toggleAddMembersPopup}
                  >
                    <span>Invite members</span>
                    <IoIosArrowForward />
                  </button>
                </div>
              ))}
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
      <EditDesc
        isVisible={changeDescVisible}
        isActive={changeDescActive}
        ref={changeDescRef}
        setDisable={setDisableChangeDesc}
        togglePopup={toggleChangeDescPopup}
      />
      <EditIcon
        isVisible={iconVisible}
        isActive={iconActive}
        ref={iconRef}
        togglePopup={toggleIconPopup}
        setDisable={setDisableIcon}
      />
      <AddMembersPopup
        isVisible={addMembersVisible}
        isActive={addMembersActive}
        ref={addMembersRef}
        togglePopup={toggleAddMembersPopup}
        setDisable={setDisableAddMembers}
      />
    </>
  );
};

export default TeamMenu;
