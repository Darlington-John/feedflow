import { FaStar } from "react-icons/fa";
import { IoIosList } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
interface filterPriorityProps {
  toggleFilterPop: () => void;
  isFilterPopVisible: boolean;
  filterPop: boolean;
  filterPopRef: React.RefObject<HTMLDivElement | null>;
  selectedPriority: string;
  handlePriorityClick: (priority: string) => void;
}
const PriorityFilter = ({
  toggleFilterPop,
  isFilterPopVisible,
  filterPop,
  filterPopRef,
  selectedPriority,
  handlePriorityClick,
}: filterPriorityProps) => {
  const priorities = [
    { type: "All" },
    { type: "1" },
    { type: "2" },
    { type: "3" },
    { type: "4" },
    { type: "5" },
  ];
  return (
    <div className="relative  shrink-0">
      <button
        className="flex items-center gap bg-grey rounded-full py-1 px-2   "
        onClick={toggleFilterPop}
      >
        <span className="text-xs text-darkGrey ">Priority</span>
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
          {priorities.map((pri) => (
            <button
              key={pri.type}
              onClick={() => {
                handlePriorityClick(pri.type);
                toggleFilterPop();
              }}
              className={`cursor-pointer px-3 py-2 text-sm max-xs:text-[11px] transition-colors duration-200 flex gap-2 items-center ${
                selectedPriority === pri.type
                  ? "bg-grey text-white"
                  : "text-white hover:bg-navy"
              }`}
            >
              <span className="flex items-center gap-1">
                {pri.type === "All" ? (
                  <IoIosList className="text-white" size={18} />
                ) : (
                  // Generate stars equal to priority number
                  Array.from({ length: Number(pri.type) }, (_, i) => (
                    <FaStar key={i} size={18} className="text-powder-blue" />
                  ))
                )}
              </span>
              <span>{pri.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityFilter;
