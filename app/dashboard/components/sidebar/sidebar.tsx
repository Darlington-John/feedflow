"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi2";
const Sidebar = () => {
  const pathname = usePathname();
  const routes = [
    {
      id: 1,
      to: "Overview",
      href: "/dashboard",
      icon: <GoHome size={24} className="text-silver-blue" />,
      icon_active: <GoHomeFill size={24} className="text-silver-blue" />,
    },
    {
      id: 2,
      to: "Teams",
      href: "/dashboard/teams",
      icon: <HiOutlineUserGroup className="text-silver-blue" size={24} />,
      icon_active: <HiUserGroup className="text-silver-blue" size={24} />,
    },
    {
      id: 3,
      to: "Explore",
      href: "/explore",
      icon: <FaHome />,
      icon_active: <FaHome />,
    },
    {
      id: 4,
      to: "All",
      href: "/all",
      icon: <FaHome />,
      icon_active: <FaHome />,
    },
  ];
  return (
    <div className=" w-[300px] bg-navy  border-r  border-r-grey px-4 py-4   max-h-[calc(100vh-57px)] min-h-[calc(100vh-57px)]  mt-[57px]  items-center   flex flex-col divide-y  overflow-auto sidebar">
      <div className="flex flex-col w-full  gap-1">
        {routes.map((route) => (
          <Link
            href={route.href}
            className={`flex items-center gap-3  w-full   h-[45px] rounded pl-6 duration-100    ${
              pathname === route.href ? "bg-grey" : " hover:bg-fade-grey"
            }`}
            key={route.id}
          >
            {pathname === route.href ? route.icon_active : route.icon}
            <span className="text-sm text-light-blue">{route.to}</span>
          </Link>
        ))}

        {/* <Accordion /> */}
      </div>
    </div>
  );
};

export default Sidebar;
