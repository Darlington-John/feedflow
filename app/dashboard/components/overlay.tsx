"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUtilsContext } from "~/app/context/utils-context";
import Sidebar from "./sidebar/sidebar";
const Overlay = () => {
  const { setOverlayOpen } = useUtilsContext();

  const linkname = usePathname();
  useEffect(() => {
    const overlayElement = document.getElementById("overlay");

    if (!overlayElement) {
      return;
    }
    overlayElement.style.transform = "translateY(-100%)";

    setOverlayOpen(false);
  }, [linkname, setOverlayOpen]);

  return (
    <div
      className=" hidden w-full  fixed z-40 top-0 right-0 bg-navy  max-md:flex      flex-col gap-16 justify-end   ease-out duration-[0.4s]  h-full text-[#fff]  "
      id="overlay"
    >
      <div className=" w-full  py-4   h-full mt-[57px]  items-center   flex flex-col divide-y  overflow-auto sidebar ">
        <Sidebar hidden={false} />
      </div>
    </div>
  );
};

export default Overlay;
