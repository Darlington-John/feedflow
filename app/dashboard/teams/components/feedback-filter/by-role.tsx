import { IoIosList } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TiStarburst } from "react-icons/ti";
interface filterRolesProps {
  toggleFilterPop: () => void;
  isFilterPopVisible: boolean;
  filterPop: boolean;
  filterPopRef: React.RefObject<HTMLDivElement | null>;
  selectedRole: string;
  handleRoleClick: (Role: string) => void;
}
const RolesFilter = ({
  toggleFilterPop,
  isFilterPopVisible,
  filterPop,
  filterPopRef,
  selectedRole,
  handleRoleClick,
}: filterRolesProps) => {
  const roles = [
    {
      type: "All",

      icon: <IoIosList className="text-white" size={18} />,
    },
    {
      type: "super admin",
      icon: <TiStarburst className="text-[#783a71]" size={18} />,
    },
    {
      type: "admin",
      icon: <TiStarburst className="text-[#2563EB]" size={18} />,
    },
    {
      type: "member",
      icon: <TiStarburst className="text-[#14B8A6]" size={18} />,
    },
  ];

  return (
    <div className="relative  shrink-0">
      <button
        className="flex items-center gap bg-grey rounded-full py-1 px-2   "
        onClick={toggleFilterPop}
      >
        <span className="text-xs text-darkGrey ">Role</span>
        <MdKeyboardArrowDown
          className={` duration-300 ${isFilterPopVisible && "rotate-180 "} `}
          size={18}
        />
      </button>
      {filterPop && (
        <div
          className={`absolute top-7 max-xs:top-5     backdrop-blur-lg bg-[#0f212d66]  shadow-2xl  left-0 duration-300 z-20 flex flex-col  max-xs:p-2 max-xs:gap-2  overflow-hidden  w-[140px] border border-fade-grey rounded-md   ${
            isFilterPopVisible ? "mid-popup" : "mid-popup-hidden"
          } `}
          ref={filterPopRef}
        >
          {roles.map((role) => (
            <button
              key={role.type}
              onClick={() => {
                handleRoleClick(role.type);
                toggleFilterPop();
              }}
              className={`cursor-pointer px-3 py-2 text-sm  max-xs:text-[11px]  transition-colors duration-200 flex gap-2 items-center ${
                selectedRole === role.type
                  ? "bg-grey text-white"
                  : "  text-white  hover:bg-navy"
              }`}
            >
              <span>{role.icon}</span>
              <span>{role.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RolesFilter;
