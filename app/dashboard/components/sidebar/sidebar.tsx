"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi2";
const Sidebar = () => {
  const pathname = usePathname();
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
    <div className=" w-[300px] bg-navy  border-r  border-r-grey px-4 py-4   max-h-[calc(100vh-57px)] min-h-[calc(100vh-57px)]  mt-[57px]  items-center   flex flex-col divide-y  overflow-auto sidebar max-md:hidden">
      <div className="flex flex-col w-full  gap-1">
        <Link
          href={"/dashboard"}
          className={`flex items-center gap-3  w-full   h-[45px] rounded pl-6 duration-100    ${
            pathname === "/dashboard" ? "bg-grey" : " hover:bg-fade-grey"
          }`}
        >
          {pathname === "/dashboard" ? (
            <GoHomeFill size={24} className="text-silver-blue" />
          ) : (
            <GoHome size={24} className="text-silver-blue" />
          )}

          <span className="text-sm text-light-blue">Overview</span>
        </Link>
        {routes.map((route) => (
          <Link
            href={route.href}
            className={`flex items-center gap-3  w-full   h-[45px] rounded pl-6 duration-100    ${
              pathname.startsWith(route.href)
                ? "bg-grey"
                : " hover:bg-fade-grey"
            }`}
            key={route.id}
          >
            {pathname.startsWith(route.href) ? route.icon_active : route.icon}
            <span className="text-sm text-light-blue">{route.to}</span>
          </Link>
        ))}

        {/* <Accordion /> */}
      </div>
    </div>
  );
};

export default Sidebar;
