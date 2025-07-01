"use client";
import { usePopup } from "~/lib/utils/toggle-popups";
import { FaXmark } from "react-icons/fa6";
import RolesFilter from "../feedback-filter/by-role";
import { member_type } from "~/lib/types/member";

interface filterProps {
  areAllFiltersDefault: () => boolean;
  filteredMembers: member_type[] | undefined;
  selectedRole: string;
  setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
  handleRoleClick: (role: string) => void;
}

const MembersFilter = ({
  areAllFiltersDefault,
  filteredMembers,
  selectedRole,
  setSelectedRole,
  handleRoleClick,
}: filterProps) => {
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
      type: "Role",
      state: selectedRole,
      set_state: setSelectedRole,
    },
  ];
  const handleClearFilters = () => {
    setSelectedRole("");
  };
  return (
    <div className="flex w-full flex-col gap-0">
      <div className="py-3 border-t border-t-grey  flex items-center justify-between w-full  max-lg:py-5  max-xs:flex-col  max-xs:gap-3">
        <div className="flex items-center gap-3 w-full">
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
            {filteredMembers?.length} feedbacks
          </span>
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

export default MembersFilter;
