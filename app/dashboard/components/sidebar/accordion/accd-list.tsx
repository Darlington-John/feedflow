"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect, ReactNode } from "react";
import caretDown from "~/public/icons/caret-down.svg";
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
      className="overflow-hidden w-full flex flex-col   duration-100   py-3"
      {...props}
    >
      <button
        onClick={onClick}
        className="w-full h-[40px]  flex items-center justify-between border-none outline-none  rounded-lg hover:bg-fade-grey px-6"
      >
        <p className="text-xs text-grey-blue  uppercase   tracking-wider ">
          {header}
        </p>
        <Image
          className={` duration-300  ${isOpen ? "rotate-180" : "rotate-0"}`}
          alt=""
          src={caretDown}
        />
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-out overflow-hidden"
        style={{ height }}
      >
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
