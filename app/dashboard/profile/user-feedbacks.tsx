import { useParams } from "next/navigation";
import logo from "~/public/images/logo.svg";
import Image from "next/image";

import { useAuthContext } from "~/app/context/auth-context";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/lib/redux/store";
import { apiRequest } from "~/lib/utils/api-request";

import { toast } from "react-toastify";
import Loader from "../components/loader";
import FeedbackFilter from "../teams/components/feedback-filter/filter";
import AsyncButton from "../components/buttons/async-button";
import {
  addMoreUserFeedbacks,
  setUserFeedbacks,
} from "~/lib/redux/slices/user-feedbacks";
import FeedbackCompactCard from "../teams/components/feedback-card/feedback-compact-card";
const Feedbacks = () => {
  const { user, loading: fetchingUser } = useAuthContext();
  const { team_id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetchingError, setFetchingError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const feedbacks = useSelector(
    (state: RootState) => state.user_feedbacks.userFeedbacks
  );

  const [feedbacksCount, setFeedbacksCount] = useState(0);
  useEffect(() => {
    if (fetchingUser) {
      return;
    }
    const fetchFeedbacks = async () => {
      setLoading(true);
      await apiRequest({
        method: "GET",
        url: `/api/user/fetch-feedbacks?userId=${user?._id}`,
        onSuccess: (res) => {
          dispatch(setUserFeedbacks(res.result));
          setFetchingError(false);
          setFeedbacksCount(res.feedbacks_count);
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

    fetchFeedbacks();
  }, [dispatch, user?._id, team_id, user, fetchingUser]);
  const [skip, setSkip] = useState(feedbacks?.length);
  const [showMore, setShowMore] = useState(
    (feedbacksCount as number) > feedbacks?.length
  );

  useEffect(() => {
    setSkip(feedbacks?.length);
    setShowMore((feedbacksCount as number) > feedbacks?.length);
  }, [feedbacks?.length, feedbacksCount]);
  const [moreFeedbacksLoading, setMoreFeedbacksLoading] = useState(false);
  const [moreFeedbacksSuccess, setMoreFeedbacksSuccess] = useState(false);
  const loadMoreFeedbacks = async () => {
    setMoreFeedbacksLoading(true);
    await apiRequest({
      method: "GET",
      url: `/api/user/fetch-feedbacks/fetch-more?skip=${skip}&userId=${user?._id}`,
      onSuccess: (res) => {
        setMoreFeedbacksSuccess(true);
        const newFeedbacks = res.result;
        const newSkip = skip + newFeedbacks.length;
        setSkip(newSkip);
        setShowMore(newSkip < feedbacks.length);
        dispatch(addMoreUserFeedbacks(newFeedbacks));

        setTimeout(() => {
          setMoreFeedbacksSuccess(false);
        }, 2000);
      },
      onError: (error) => {
        console.log(error);
        toast.error(`Could'nt fetch more feedbacks`);
      },
      onFinally: () => {
        setMoreFeedbacksLoading(false);
      },
    });
  };
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };
  const handlePriorityClick = (priority: string) => {
    setSelectedPriority(priority);
  };
  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
  };
  const filteredFeedbacks = (() => {
    const filteredFeedbacks = feedbacks?.filter((feedback) => {
      const tagMatch =
        selectedTag === "All" ||
        feedback?.type?.toLowerCase() === selectedTag.toLowerCase();

      const priorityMatch =
        selectedPriority === "All" ||
        feedback?.priority.toString() === selectedPriority.toString();

      const roleMatch =
        selectedRole === "All" ||
        (selectedRole === "admin" &&
          feedback.adminIds?.includes(feedback.by._id)) ||
        (selectedRole === "super admin" &&
          feedback.superAdminIds?.includes(feedback.by._id)) ||
        (selectedRole === "member" &&
          !feedback.adminIds?.includes(feedback.by._id) &&
          !feedback.superAdminIds?.includes(feedback.by._id));

      return tagMatch && priorityMatch && roleMatch;
    });

    return filteredFeedbacks;
  })();

  const areAllFiltersDefault = () => {
    const isTagDefault = selectedTag === "All";
    const isPriorityDefault = selectedPriority === "All";
    const isRoleDefault = selectedRole === "All";
    return !(!isTagDefault || !isPriorityDefault! || !isRoleDefault);
  };

  return (
    <>
      <Loader
        fetching={loading || fetchingUser}
        errorFetching={fetchingError}
        error={fetchError}
      >
        <div className="flex items-start  w-full flex-col gap-2">
          <div className="flex items-center justify-between w-full  py-2">
            {feedbacksCount > 0 && (
              <h1 className="text-xl sf-light text-silver-blue  max-sm:text-lg">
                Total Feedbacks: {feedbacksCount}
              </h1>
            )}
          </div>

          <div className="flex w-full items-center justify-between py-2">
            <FeedbackFilter
              handleTagClick={handleTagClick}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              filteredFeedbacks={filteredFeedbacks}
              areAllFiltersDefault={areAllFiltersDefault}
              handlePriorityClick={handlePriorityClick}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              setSelectedRole={setSelectedRole}
              selectedRole={selectedRole}
              handleRoleClick={handleRoleClick}
            />
          </div>
          {areAllFiltersDefault() ? (
            feedbacks && feedbacks?.length > 0 ? (
              feedbacks?.map((feed) => (
                <FeedbackCompactCard
                  feed={feed}
                  key={feed._id}
                  setFeedbackCount={setFeedbacksCount}
                />
              ))
            ) : (
              <div className="min-h-[50vh]  flex  items-center justify-center flex-col gap-2  mx-auto">
                <Image src={logo} className="w-16" alt="logo" />
                <h1 className="text-lg   text-center text-light-blue">
                  No feedbacks yet
                </h1>
                <p className="text-[#4696dd] text-sm  w-72  text-center">
                  You have&apos;t give a feedback yet... Once you do, your
                  feedbacks will show up here
                </p>
              </div>
            )
          ) : filteredFeedbacks && filteredFeedbacks?.length > 0 ? (
            filteredFeedbacks?.map((feed) => (
              <FeedbackCompactCard
                feed={feed}
                key={feed._id}
                setFeedbackCount={setFeedbacksCount}
              />
            ))
          ) : (
            <div className="min-h-[50vh]  flex  items-center justify-center flex-col gap-2 mx-auto">
              <Image src={logo} className="w-16" alt="logo" />
              <h1 className="text-lg   text-center text-light-blue">
                No feedbacks match your filters
              </h1>
              <p className="text-[#4696dd] text-sm  w-72  text-center">
                Try adjusting your filters.
              </p>
            </div>
          )}
          {showMore && areAllFiltersDefault() && (
            <AsyncButton
              action="+View  more feedbacks"
              loading={moreFeedbacksLoading}
              success={moreFeedbacksSuccess}
              classname_overide="max-w-34 !h-[30px] text-xs "
              onClick={loadMoreFeedbacks}
              disabled={feedbacksCount === feedbacks.length}
            />
          )}
        </div>
      </Loader>
    </>
  );
};

export default Feedbacks;
