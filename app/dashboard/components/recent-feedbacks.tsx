import { usePageFetch } from "~/lib/utils/fetch-page-data";
import Loader from "./loader";
import { feedback_type } from "~/lib/types/feedback";
import { useAuthContext } from "~/app/context/auth-context";
import FeedbackCompactCard from "../teams/components/feedback-card/feedback-compact-card";
import Image from "next/image";
import logo from "~/public/images/logo.svg";
const RecentFeedbacks = () => {
  const { user } = useAuthContext();
  const { fetchedData, isFetching, hasError, error } = usePageFetch<
    feedback_type[]
  >({
    basePath: `/api/user/fetch-feedbacks?userId=${user?._id}`,
    enabled: !!user?._id,
    dep: user,
  });
  return (
    <Loader fetching={isFetching} errorFetching={hasError} error={error}>
      <section className="flex flex-col gap-2 w-full  ">
        <h1 className="text-2xl sf-light  max-xs:text-xl">
          Most recent feedbacks
        </h1>
        {fetchedData && fetchedData.length > 0 ? (
          fetchedData.map((feed) => (
            <FeedbackCompactCard feed={feed} key={feed._id} />
          ))
        ) : (
          <div className="flex items-center justify-center h-[400px] flex-col gap-2">
            <Image className="w-20" alt="" src={logo} />
            <div className="flex flex-col gap-1">
              <h1 className="text-sm text-silver-blue text-center">
                No Feedbacks yet
              </h1>
              <h1 className="text-xs  text-silver-blue">
                Your most recent feedback will show up here.
              </h1>
            </div>
          </div>
        )}
      </section>
    </Loader>
  );
};

export default RecentFeedbacks;
