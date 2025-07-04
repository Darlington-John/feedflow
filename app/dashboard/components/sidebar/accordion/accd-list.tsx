"use client";
import { usePathname } from "next/navigation";
import React, { useRef, useState, useEffect, ReactNode } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
interface AccordionItemProps {
  isOpen: boolean;
  onClick: () => void;
  header: string;
  children: ReactNode;
  rerenderKey?: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  isOpen,
  onClick,
  header,
  rerenderKey,
  children,
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen, rerenderKey]);

  return (
    <div
      className="overflow-hidden w-full flex flex-col   duration-100 gap-1    "
      {...props}
    >
      <button
        onClick={onClick}
        className={`flex items-center justify-between  w-full   h-[45px] rounded px-6 duration-100   ${
          pathname.startsWith("/dashboard/teams")
            ? "bg-fade-grey"
            : "hover:bg-fade-grey"
        }  `}
      >
        <div className="flex gap-2 items-center ">
          <HiUserGroup className="text-silver-blue" size={24} />

          <p className="text-xs text-grey-blue  uppercase   tracking-wider ">
            {header}
          </p>
        </div>
        <FaAngleDown
          className={` duration-300 text-sm text-grey-blue   ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        ref={contentRef}
        className="transition-all duration-300 ease-out overflow-hidden"
        style={{ height }}
      >
        <div className="flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
