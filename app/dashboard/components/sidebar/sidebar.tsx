"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHome, GoHomeFill } from "react-icons/go";
import { Accordion } from "./accordion/accordion";
import { useAuthContext } from "~/app/context/auth-context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/lib/redux/store";
import { apiRequest } from "~/lib/utils/api-request";
import { setTeams } from "~/lib/redux/slices/teams";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi2";
import { useUtilsContext } from "~/app/context/utils-context";
interface Prop {
  hidden?: boolean;
}
const Sidebar = ({ hidden = true }: Prop) => {
  const pathname = usePathname();

  const { user, loading: fetchingUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetchingError, setFetchingError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const teams = useSelector((state: RootState) => state.teams.teams);
  const { setRerenderKey, rerenderKey } = useUtilsContext();
  useEffect(() => {
    if (fetchingUser) {
      return;
    }
    const fetchTeams = async () => {
      setLoading(true);
      await apiRequest({
        method: "GET",
        url: `/api/teams/fetch-teams?userId=${user?._id}`,
        onSuccess: (res) => {
          dispatch(setTeams(res.result));
          setFetchingError(false);
          setTimeout(() => setRerenderKey((prev) => prev + 1), 1000);
        },
        onError: (error) => {
          setFetchError(error);
          setFetchingError(true);
        },
        onFinally: () => {
          setLoading(false);
        },
      });
    };

    fetchTeams();
  }, [dispatch, fetchingUser, user?._id, setRerenderKey]);

  return (
    <div
      className={`w-[300px] bg-navy  border-r  border-r-grey px-4 py-4   max-h-[calc(100vh-57px)] min-h-[calc(100vh-57px)]  mt-[57px]  items-center   flex flex-col divide-y  overflow-auto sidebar   relative z-10 max-md:w-full max-md:mt-0  max-md:border-r-0 max-md:min-h-auto  max-md:p-2 ${
        hidden ? "max-md:hidden" : " "
      }`}
    >
      <div className="flex flex-col w-full  gap-1">
        <Link
          href={"/dashboard"}
          className={`flex items-center gap-3  w-full   h-[45px] rounded pl-6 duration-100    ${
            pathname === "/dashboard" ? "bg-grey" : " hover:bg-fade-grey"
          }`}
        >
          {pathname === "/dashboard" ? (
            <GoHomeFill size={24} className="text-silver-blue" />
          ) : (
            <GoHome size={24} className="text-silver-blue" />
          )}

          <span className="text-sm text-light-blue">Overview</span>
        </Link>
        {teams?.length > 0 ? (
          <Accordion
            teams={teams}
            isFetching={loading}
            hasError={fetchingError}
            error={fetchError}
            rerenderKey={rerenderKey}
          />
        ) : (
          <Link
            href={"/dashboard/teams"}
            className={`flex items-center gap-3  w-full   h-[45px] rounded pl-6 duration-100    ${
              pathname.startsWith("/dashboard/teams")
                ? "bg-grey"
                : " hover:bg-fade-grey"
            }`}
          >
            {pathname.startsWith("/dashboard/teams") ? (
              <HiUserGroup className="text-silver-blue" size={24} />
            ) : (
              <HiOutlineUserGroup className="text-silver-blue" size={24} />
            )}
            <span className="text-sm text-light-blue">Teams</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
