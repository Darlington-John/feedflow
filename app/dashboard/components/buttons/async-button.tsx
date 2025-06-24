import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import loader from "~/public/images/loading.svg";
interface asyncProps {
  className?: string;
  action: string;
  loading: boolean;
  success: boolean;
  disabled?: boolean;
  classname_overide?: string;
  buttonType?: "button" | "submit" | "reset" | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
const AsyncButton = ({
  className = "  flex items-center justify-center    rounded-full   text-center bg-powder-blue text-white  w-full h-[45px] text-sm ",
  action,
  loading,
  success,
  disabled,
  classname_overide,
  onClick,
  buttonType = "button",
}: asyncProps) => {
  return (
    <button
      className={`${classname_overide}  ${className} ${
        disabled && "opacity-50"
      }`}
      disabled={disabled}
      onClick={onClick}
      type={buttonType}
    >
      {success ? (
        <FaCheck className="w-6" />
      ) : loading ? (
        <Image src={loader} className="w-7" alt="" />
      ) : (
        action
      )}
    </button>
  );
};

export default AsyncButton;
