"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUtilsContext } from "~/app/context/utils-context";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi2";
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

  const routes = [
    {
      id: 1,
      to: "Teams",
      href: "/dashboard/teams",
      icon: <HiOutlineUserGroup className="text-silver-blue" size={24} />,
      icon_active: <HiUserGroup className="text-silver-blue" size={24} />,
    },
    {
      id: 2,
      to: "Explore",
      href: "/explore",
      icon: <HiOutlineUserGroup className="text-silver-blue" size={24} />,
      icon_active: <HiUserGroup className="text-silver-blue" size={24} />,
    },
    {
      id: 3,
      to: "All",
      href: "/all",
      icon: <HiOutlineUserGroup className="text-silver-blue" size={24} />,
      icon_active: <HiUserGroup className="text-silver-blue" size={24} />,
    },
  ];
  return (
    <div
      className=" hidden w-full  fixed z-40 top-0 right-0 bg-navy  max-md:flex      flex-col gap-16 justify-end   ease-out duration-[0.4s]  h-full text-[#fff] "
      id="overlay"
    >
      <div className=" w-full  py-4   h-full mt-[57px]  items-center   flex flex-col divide-y  overflow-auto sidebar ">
        <div className="flex flex-col w-full  gap-2">
          <Link
            href={"/dashboard"}
            className={`flex items-center gap-3  w-full   h-[45px]  pl-6 duration-100    ${
              linkname === "/dashboard" ? "bg-grey" : " hover:bg-fade-grey"
            }`}
          >
            {linkname === "/dashboard" ? (
              <GoHomeFill size={24} className="text-silver-blue" />
            ) : (
              <GoHome size={24} className="text-silver-blue" />
            )}

            <span className="text-sm text-light-blue">Overview</span>
          </Link>
          {routes.map((route) => (
            <Link
              href={route.href}
              className={`flex items-center gap-3  w-full   h-[50px]  pl-6 duration-100    ${
                linkname.startsWith(route.href)
                  ? "bg-grey"
                  : " hover:bg-fade-grey border-b border-b-grey "
              }`}
              key={route.id}
            >
              {linkname.startsWith(route.href) ? route.icon_active : route.icon}
              <span className="text-sm text-light-blue">{route.to}</span>
            </Link>
          ))}

          {/* <Accordion /> */}
        </div>
      </div>
    </div>
  );
};

export default Overlay;
