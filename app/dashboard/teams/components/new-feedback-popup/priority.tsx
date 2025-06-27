import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface PriorityRatingProps {
  onChange?: (rating: number) => void; // optional callback
  size?: number;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const PriorityRating = ({
  onChange,
  size = 24,
  value,
  setValue,
}: PriorityRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setValue(index);
    if (onChange) onChange(index);
  };

  return (
    <div className="flex gap-1 ring-fade-blue   rounded-full h-11 overflow-hidden duration-150 border border-grey flex items-center px-3">
      <span className="text-base">Priority:</span>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = hover ? star <= hover : star <= value;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            className="focus:outline-none "
          >
            <FaStar
              size={size}
              color={isFilled ? "#0AA0EA" : "#d1d5db"} // gray-300
              className="transition-colors duration-200"
            />
          </button>
        );
      })}
    </div>
  );
};

export default PriorityRating;
