import { FaPlus } from "react-icons/fa6";
import NewFeedbackPopup from "../components/new-feedback-popup/feedback-popup";
import { usePopup } from "~/lib/utils/toggle-popups";
import { useParams } from "next/navigation";
import { usePageFetch } from "~/lib/utils/fetch-page-data";
import { feedback_type } from "~/lib/types/feedback";
import logo from "~/public/images/logo.svg";
import Image from "next/image";
import Loader from "../../components/loader";
import { useAuthContext } from "~/app/context/auth-context";
import FeedbackCard from "../components/feedback-card/feedback-card";
import FeedbackFilter from "../components/feedback-filter/filter";
import { useState } from "react";
const Feedbacks = () => {
  const {
    isActive: feedbackPopup,
    isVisible: feedbackPopupVisible,
    ref: feedbackRef,
    setDisableToggle: disableFeedbackPopup,
    togglePopup: toggleFeedbackPopup,
  } = usePopup();

  const { user } = useAuthContext();
  const { team_id } = useParams();
  const {
    fetchedData: feedbacks,
    isFetching,
    hasError,
    error,
  } = usePageFetch<feedback_type[]>({
    basePath: `/api/teams/${team_id}/fetch-feedbacks?userId=${user?._id}`,
    eventKey: "refreshFeedbacks",
    dep: team_id,
    enabled: !!user?._id,
  });
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  console.log("feedback", feedbacks);
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
      <Loader fetching={isFetching} errorFetching={hasError} error={error}>
        <div className="flex items-start  w-full flex-col gap-2">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl sf-light text-silver-blue ">
              Feedbacks: 24
            </h1>
            <button
              className="flex items-center gap-1  bg-powder-blue  py-2 px-3 rounded-full  text-white hover:ring ring-white duration-150"
              onClick={toggleFeedbackPopup}
            >
              <FaPlus size={20} />
              <h1 className="text-sm  ">Give feedback</h1>
            </button>
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
                <FeedbackCard feed={feed} key={feed._id} />
              ))
            ) : (
              <div className="min-h-[50vh]  flex  items-center justify-center flex-col gap-2">
                <Image src={logo} className="w-16" alt="logo" />
                <h1 className="text-lg   text-center text-light-blue">
                  No feedbacks yet
                </h1>
                <p className="text-[#4696dd] text-sm  w-72  text-center">
                  No members has made a feedback yet... Once they do, their
                  feedbacks will show up here
                </p>
              </div>
            )
          ) : filteredFeedbacks && filteredFeedbacks?.length > 0 ? (
            filteredFeedbacks?.map((feed) => (
              <FeedbackCard feed={feed} key={feed._id} />
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
        </div>
      </Loader>
      <NewFeedbackPopup
        newFeedbackPopup={feedbackPopup}
        newFeedbackPopupVisible={feedbackPopupVisible}
        newFeedbackPopupRef={feedbackRef}
        disableNewFeedbackPopup={disableFeedbackPopup}
        toggleNewFeedbackPopup={toggleFeedbackPopup}
      />
    </>
  );
};

export default Feedbacks;
