"use client";
import { usePopup } from "~/lib/utils/toggle-popups";
import TagsFilter from "./by-tag";
import { feedback_type } from "~/lib/types/feedback";
import { FaXmark } from "react-icons/fa6";
import PriorityFilter from "./by-priority";
import RolesFilter from "./by-role";

interface filterProps {
  handleTagClick: (tag: string) => void;
  selectedTag: string;
  handlePriorityClick: (priority: string) => void;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
  areAllFiltersDefault: () => boolean;
  filteredFeedbacks: feedback_type[] | undefined;
  selectedPriority: string;
  setSelectedPriority: React.Dispatch<React.SetStateAction<string>>;
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;

  handleRoleClick: (role: string) => void;
}

const FeedbackFilter = ({
  handleTagClick,
  selectedTag,
  setSelectedTag,
  areAllFiltersDefault,
  filteredFeedbacks,
  selectedPriority,
  setSelectedPriority,
  handlePriorityClick,
  selectedRole,
  setSelectedRole,
  handleRoleClick,
}: filterProps) => {
  const {
    isVisible: isTagPopVisible,
    isActive: tagPop,
    ref: tagPopRef,
    togglePopup: toggleTagPop,
  } = usePopup();
  const {
    isVisible: isPriorityPopVisible,
    isActive: priorityPop,
    ref: priorityPopRef,
    togglePopup: togglePriorityPop,
  } = usePopup();
  const {
    isVisible: isRolePopVisible,
    isActive: rolePop,
    ref: rolePopRef,
    togglePopup: toggleRolePop,
  } = usePopup();

  const filterStates = [
    {
      id: 1,
      hidden_state: "All",
      type: "Tag",
      state: selectedTag,
      set_state: setSelectedTag,
    },
    {
      id: 1,
      hidden_state: "All",
      type: "Priority",
      state: selectedPriority,
      set_state: setSelectedPriority,
    },
    {
      id: 1,
      hidden_state: "All",
      type: "Role",
      state: selectedRole,
      set_state: setSelectedRole,
    },
  ];
  const handleClearFilters = () => {
    setSelectedTag("All");
    setSelectedPriority("All");
  };
  return (
    <div className="flex w-full flex-col gap-0">
      <div className="py-3 border-t border-t-grey  flex items-center justify-between w-full  max-lg:py-5  max-xs:flex-col  max-xs:gap-3">
        <div className="flex items-center gap-3 w-full">
          <TagsFilter
            toggleFilterPop={toggleTagPop}
            isFilterPopVisible={isTagPopVisible}
            filterPop={tagPop}
            filterPopRef={tagPopRef}
            selectedTag={selectedTag}
            handleTagClick={handleTagClick}
          />
          <PriorityFilter
            toggleFilterPop={togglePriorityPop}
            isFilterPopVisible={isPriorityPopVisible}
            filterPop={priorityPop}
            filterPopRef={priorityPopRef}
            selectedPriority={selectedPriority}
            handlePriorityClick={handlePriorityClick}
          />
          <RolesFilter
            toggleFilterPop={toggleRolePop}
            isFilterPopVisible={isRolePopVisible}
            filterPop={rolePop}
            filterPopRef={rolePopRef}
            selectedRole={selectedRole}
            handleRoleClick={handleRoleClick}
          />
        </div>
        <div className="flex items-center gap-2  shrink-0 max-xs:self-start">
          <span className="text-xs  text-silver-blue  sf-light ">
            {filteredFeedbacks?.length} feedbacks
          </span>
          <div className="flex items-center gap-2 ">
            <span className="text-xs  text-silver-blue  sf-light">Sort by</span>
            {/* <SortBy {...sortProps} /> */}
          </div>
        </div>
      </div>
      {!areAllFiltersDefault() && (
        <div className="w-full flex items-center  gap-2">
          {filterStates.map(
            (data) =>
              data.state !== data.hidden_state && (
                <div
                  className="flex gap-1 ring-fade-blue   rounded-full h-6 border border-grey flex items-center px-1 text-silver-blue"
                  key={data.id}
                >
                  <span className="text-xs">
                    {data.type}: {data.state}
                  </span>

                  <FaXmark size={10} onClick={() => data.set_state("All")} />
                </div>
              )
          )}
          <button
            className="text-xs underline sf-light text-silver-blue"
            onClick={handleClearFilters}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackFilter;
