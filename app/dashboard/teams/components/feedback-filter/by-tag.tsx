import { FaLightbulb } from "react-icons/fa6";
import { IoIosList } from "react-icons/io";
import { MdBugReport, MdKeyboardArrowDown } from "react-icons/md";
import { TiStarburst } from "react-icons/ti";
interface filterTagsProps {
  toggleFilterPop: () => void;
  isFilterPopVisible: boolean;
  filterPop: boolean;
  filterPopRef: React.RefObject<HTMLDivElement | null>;
  selectedTag: string;
  handleTagClick: (tag: string) => void;
}
const TagsFilter = ({
  toggleFilterPop,
  isFilterPopVisible,
  filterPop,
  filterPopRef,
  selectedTag,
  handleTagClick,
}: filterTagsProps) => {
  const tags = [
    {
      type: "All",
      icon: <IoIosList className="text-white" size={18} />,
    },
    {
      type: "Bug",
      icon: <MdBugReport className="text-[#BE185D]" size={18} />,
    },
    {
      type: "Idea",
      icon: <FaLightbulb className="text-[#FFD700]" size={18} />,
    },
    {
      type: "Feature",
      icon: <TiStarburst className="text-powder-blue" size={18} />,
    },
  ];

  return (
    <div className="relative  shrink-0">
      <button
        className="flex items-center gap bg-grey rounded-full py-1 px-2   "
        onClick={toggleFilterPop}
      >
        <span className="text-xs text-darkGrey ">Tag</span>
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
          {tags.map((tag) => (
            <button
              key={tag.type}
              onClick={() => {
                handleTagClick(tag.type);
                toggleFilterPop();
              }}
              className={`cursor-pointer px-3 py-2 text-sm  max-xs:text-[11px]  transition-colors duration-200 flex gap-2 items-center ${
                selectedTag === tag.type
                  ? "bg-grey text-white"
                  : "  text-white  hover:bg-navy"
              }`}
            >
              <span>{tag.icon}</span>
              <span>{tag.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsFilter;
