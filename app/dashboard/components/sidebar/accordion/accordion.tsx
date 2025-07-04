"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AccordionItem from "./accd-list";
import { team_type } from "~/lib/types/team";
import loadGif from "~/public/images/loading.svg";
import { FaList } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
interface accordion_props {
  teams: team_type[];
  isFetching: boolean;
  hasError: boolean;
  error: string;
  rerenderKey: number;
}
export const Accordion = ({
  teams,
  isFetching,
  hasError,
  rerenderKey,
}: accordion_props) => {
  const [openIds, setOpenIds] = useState<(string | number)[]>([0, 1]);
  const toggleItem = (id: string | number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const linkname = usePathname();

  return (
    <div className="w-full flex flex-col divide-y  divide-grey     ">
      {hasError ? null : isFetching ? (
        <div className="w-full py-2">
          <Image src={loadGif} className="w-6 mx-auto" alt="" />
        </div>
      ) : (
        <AccordionItem
          isOpen={openIds.includes(1)}
          onClick={() => toggleItem(1)}
          header="Teams"
          rerenderKey={rerenderKey}
        >
          <Link
            href={"/dashboard/teams"}
            className={`flex items-center gap-2  px-6 h-[40px]  rounded-md ${
              linkname === "/dashboard/teams" ? "bg-grey" : "hover:bg-fade-grey"
            }`}
          >
            <FaList className="text-sm  text-base  text-silver-blue" />
            <span className="text-xs text-grey-blue  uppercase">All teams</span>
          </Link>
          {teams &&
            teams.map((team) => (
              <Link
                href={`/dashboard/teams/${team._id}?query=feedbacks`}
                className={`flex items-center gap-2  flex items-center gap-2  px-6 h-[40px]  rounded-lg  ${
                  linkname.startsWith(`/dashboard/teams/${team._id}`)
                    ? "bg-grey"
                    : "hover:bg-fade-grey"
                }`}
                key={team._id}
              >
                {team.icon ? (
                  //  eslint-disable-next-line
                  <img
                    src={team?.icon}
                    className=" rounded-full object-cover  w-8  h-8  0 "
                    alt=""
                  />
                ) : (
                  <div className="items-center justify-center  flex  rounded-full bg-grey   h-8 w-8    0  text-silver-blue  ring ring-powder-blue text-2xl">
                    <HiUserGroup />
                  </div>
                )}
                <span className="line-clamp-1  text-sm  text-light-blue">
                  {team.name}
                </span>
              </Link>
            ))}
        </AccordionItem>
      )}
    </div>
  );
};
