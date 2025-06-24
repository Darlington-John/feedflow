"use client";
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import { usePopup } from "~/lib/utils/toggle-popups";
import NewTeamPopup from "./components/new-team-popup";
import ChatTest from "../components/chat-test";
import { usePageFetch } from "~/lib/utils/fetch-page-data";
import { team_type } from "~/lib/types/team";
import Loader from "../components/loader";
import { useAuthContext } from "../../context/auth-context";
import { IoBanOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Link from "next/link";

const Teams = () => {
  const {
    isActive: newTeamPopup,
    isVisible: newTeamPopupVisible,
    ref: newTeamPopupRef,
    togglePopup: toggleNewTeamPopup,
    setDisableToggle: disableNewTeamPopup,
  } = usePopup();
  const { user } = useAuthContext();
  const { fetchedData, isFetching, hasError, error } = usePageFetch<
    team_type[]
  >({
    basePath: `/api/teams/fetch-teams?userId=${user?._id}`,
    enabled: !!user?._id,
    dep: user,
  });
  return (
    <>
      <div
        className={`min-h-screen bg-navy flex flex-col py-5 px-8 ${
          !user && "items-center justify-center"
        }`}
      >
        {user ? (
          <Loader fetching={isFetching} errorFetching={hasError} error={error}>
            <div className="flex items-center w-full justify-between">
              <h1 className="text-2xl uppercase sf-light">Teams</h1>
              <button
                className="flex items-center gap-1  bg-powder-blue h-[40px] rounded-full px-2"
                onClick={toggleNewTeamPopup}
              >
                <FaPlus />
                <span>Create team</span>
              </button>
            </div>
            <div className="flex items-start gap-4 flex-wrap">
              {fetchedData?.map((team) => (
                <Link
                  href={`/teams/${team._id}`}
                  className="flex flex-col gap-2 items-center p-2 border border-grey  rounded-md  w-[350px] py-5  relative  hover:shadow-2xl duration-150 hover:border-grey-blue"
                  key={team.updatedAt}
                >
                  <button className="w-6  h-6  absolute right-5 top-5  text-grey  flex items-center justify-center rounded-full hover:ring ring-grey-blue  duration-15o ">
                    <FaEllipsisVertical size={18} className="text-grey-blue" />
                  </button>
                  {team.icon ? (
                    //  eslint-disable-next-line
                    <img
                      src={team?.icon}
                      className=" rounded-full object-cover  w-36  h-36 "
                      alt=""
                    />
                  ) : (
                    <div className="items-center justify-center  flex  rounded-full bg-grey w-36  h-36 ">
                      <HiUserGroup size={50} />
                    </div>
                  )}
                  <div className="flex w-full items-center  flex-col">
                    <h1 className="text-sm sf-bold  text-white  line-clamp-1 capitalize text-center">
                      {team.name}
                    </h1>
                    <span className="text-center  text-silver-blue text-xs">
                      {team.members.length}{" "}
                      {team.members.length > 1 ? "members" : "member"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <ChatTest />
          </Loader>
        ) : (
          <div
            className={`w-[350px]      duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg rounded-lg bg-fade-grey   items-center`}
          >
            <div className="flex flex-col gap-3 items-center w-full">
              <div className="flex flex-col gap-2 items-center  text-silver-blue">
                <IoBanOutline size={40} className="text-red" />
                <h1 className="text-2xl louize text-center">
                  {" "}
                  You&apos;re not logged in
                </h1>
                <p className="text-sm neue-light  text-center">
                  You need to log in to access your teams or create a new team
                  from scratch.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <NewTeamPopup
        newTeamPopup={newTeamPopup}
        newTeamPopupVisible={newTeamPopupVisible}
        newTeamPopupRef={newTeamPopupRef}
        toggleNewTeamPopup={toggleNewTeamPopup}
        disableNewTeamPopup={disableNewTeamPopup}
      />
    </>
  );
};

export default Teams;
