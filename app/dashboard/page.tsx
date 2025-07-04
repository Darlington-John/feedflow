"use client";
import wave from "~/public/images/waving-hand-svgrepo-com.svg";
import Image from "next/image";
import { useAuthContext } from "../context/auth-context";
import { useEffect, useState } from "react";
import { apiRequest } from "~/lib/utils/api-request";
import Loader from "./components/loader";
import { feedback_type } from "~/lib/types/feedback";
import WeeklyFeedbackChart from "./components/graph/graph";
import RecentFeedbacks from "./components/recent-feedbacks";
export default function Home() {
  const { user, loading } = useAuthContext();
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [todayFeedbacks, setTodayFeedbacks] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [feedbacks, setFeedbacks] = useState<feedback_type[]>([]);
  const [error, setError] = useState("");
  const [errorFetching, setErrorFetching] = useState(false);
  useEffect(() => {
    if (loading) {
      return;
    }
    const fetchDashboardData = async () => {
      setFetching(true);

      await apiRequest({
        url: `/api/user/dashboard?userId=${user?._id}`,
        method: "GET",
        onSuccess: (res) => {
          setTotalFeedbacks(res.totalFeedbacks);
          setTodayFeedbacks(res.todayFeedbacks);
          setTotalTeams(res.totalTeams);
          setFeedbacks(res.feedbacks);
          setErrorFetching(false);
        },
        onError: (error) => {
          setError(error);
          setErrorFetching(true);
        },
        onFinally: () => {
          setFetching(false);
        },
      });
    };
    fetchDashboardData();
  }, [user, loading]);

  return (
    <div className="text-2xl flex flex-col w-full   py-8">
      <Loader fetching={fetching} error={error} errorFetching={errorFetching}>
        <div className="flex flex-col gap-4  items-start w-full px-4 ">
          <div>
            <h1 className=" sf-light  text-black  text-2xl flex items-center gap-2  max-sm:text-xl">
              <Image src={wave} alt="" className="w-4" />

              <span className="text-white">Welcome back, {user?.username}</span>
            </h1>
            <h1 className="   text-sm text-silver-blue sf-light ">
              These are the latest updates for you.
            </h1>
          </div>
          <div className=" grid grid-cols-3      justify-between  rounded-[40px]  w-full gap-3 max-sm:grid-cols-2  ">
            <div className=" p-5  rounded-lg bg-grey  flex flex-col gap-2 items-start  w-full max-md:p-2">
              <h1 className="text-sm text-silver-blue   leading-none ">
                Feedbacks made today
              </h1>
              <h1 className="text-3xl  sf-light ">{todayFeedbacks ?? 0}</h1>
            </div>
            <div className=" p-5  rounded-lg bg-grey  flex flex-col gap-2 items-start  w-full  max-md:p-2">
              <h1 className="text-sm text-silver-blue   leading-none ">
                Total Feedbacks
              </h1>
              <h1 className="text-3xl  ">{totalFeedbacks ?? 0}</h1>
            </div>

            <div className=" p-5  rounded-lg bg-grey  flex flex-col gap-2 items-start  w-full max-md:p-2">
              <h1 className="text-sm text-silver-blue   leading-none ">
                Total Teams
              </h1>
              <h1 className="text-3xl  sf-light ">{totalTeams ?? 0}</h1>
            </div>
          </div>
          <div className="w-full flex flex-col  bg-[#0aa0ea17] py-3 rounded-2xl">
            <WeeklyFeedbackChart feedbacks={feedbacks} />
            <div className="w-full mx-auto flex gap-4  items-center justify-center">
              <div className="flex gap-2 items-center">
                <h1 className="sf-light text-lg max-xs:text-xs max-2xs:hidden">
                  Weekly feedbacks
                </h1>
                <div className="flex  gap-1 items-center">
                  <div className="bg-[#4A90E2] p-2 dxs:p-1"></div>
                  <span className="text-xs text-silver-blue  sf-light ">
                    Previous week feedbacks
                  </span>
                </div>
                <div className="flex  gap-1 items-center">
                  <div className="bg-[#00AD8E] p-2 dxs:p-1"></div>
                  <span className="text-xs text-silver-blue  sf-light ">
                    Current week feedbacks
                  </span>
                </div>
              </div>
            </div>
          </div>
          <RecentFeedbacks />
        </div>
      </Loader>
    </div>
  );
}
