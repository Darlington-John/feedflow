"use client";
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import { usePageFetch } from "~/lib/utils/fetch-page-data";
import { team_type } from "~/lib/types/team";
import Loader from "../components/loader";
import { useAuthContext } from "../../context/auth-context";
import { IoBanOutline } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import Link from "next/link";
import { useUtilsContext } from "~/app/context/utils-context";

const Teams = () => {
  const { user, loading } = useAuthContext();
  const { toggleCreateTeamPopup } = useUtilsContext();
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
        className={`min-h-screen bg-navy flex flex-col py-5 px-8 max-2xs:px-4  ${
          !user && "items-center justify-center"
        }`}
      >
        {loading ? (
          <Loader fetching={loading}></Loader>
        ) : user ? (
          <Loader fetching={isFetching} errorFetching={hasError} error={error}>
            <div className="flex flex-c0l  max-w-[1500px] items-center  justify-center  flex-col mx-auto max-md:w-full">
              <div className="flex items-center w-full justify-between">
                <h1 className="text-2xl sf-light  max-sm:text-xl">Teams</h1>
                <button
                  className="flex items-center gap-1  bg-powder-blue h-[40px] rounded-full px-2 max-sm:text-sm  max-sm:h-[35px]"
                  onClick={toggleCreateTeamPopup}
                >
                  <FaPlus />
                  <span>Create team</span>
                </button>
              </div>
              <div className="flex items-start gap-4 flex-wrap py-3 max-md:grid max-md:grid-cols-2 max-md:w-full">
                {fetchedData?.map((team) => (
                  <Link
                    href={`/dashboard/teams/${team._id}?query=feedbacks`}
                    className="flex flex-col gap-2 items-center p-2 border border-grey  rounded-md  w-[350px] py-5  relative  hover:shadow-2xl duration-150 hover:border-grey-blue  max-2xl:w-[200px]  max-md:w-full"
                    key={team.updatedAt}
                  >
                    <button className="w-6  h-6  absolute right-5 top-5  text-grey  flex items-center justify-center rounded-full hover:ring ring-grey-blue  duration-15o ">
                      <FaEllipsisVertical className="text-grey-blue  text-sm " />
                    </button>
                    {team.icon ? (
                      //  eslint-disable-next-line
                      <img
                        src={team?.icon}
                        className=" rounded-full object-cover  w-36  h-36  max-2xs:w-20  max-2xs:h-20"
                        alt=""
                      />
                    ) : (
                      <div className="items-center justify-center  flex  rounded-full bg-grey w-36  h-36 w-36  h-36  max-2xs:w-20  max-2xs:h-20 ">
                        <HiUserGroup size={50} />
                      </div>
                    )}
                    <div className="flex w-full items-center  flex-col">
                      <h1 className="text-sm font-bold  text-white  line-clamp-1 capitalize text-center max-sm:font-light">
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
            </div>
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
    </>
  );
};

export default Teams;
