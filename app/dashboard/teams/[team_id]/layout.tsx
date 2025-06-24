"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Link from "next/link";
import TeamMenu from "../components/team-menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { team_id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  useEffect(() => {
    if (!team_id) {
      router.push("/");
    }
  }, [router, team_id]);
  const navigation = [
    {
      query: "feedbacks",
      to: "Feedbacks",
    },
    {
      query: "members",
      to: "Members",
    },
    {
      query: "saved",
      to: "Saved posts",
    },
  ];

  return (
    <div className="w-full  min-h-[100vh]  p-5 bg-navy  main justify-center   flex ">
      <div className="w-[1100px]  flex  gap-8  divide-y divide-grey bg-navy  items-start ">
        <div className="flex flex-col w-full  min-h-screeen">
          <div className="flex  items-center gap-6">
            {navigation.map((data, index) => (
              <Link
                key={index}
                href={`/teams/${team_id}?query=${data.query}`}
                className={`h-[40px]  px-3 text-silver-blue hover:underline text-sm flex items-center justify-center  rounded-full ${
                  query === data.query && "bg-grey"
                }`}
              >
                {data.to}
              </Link>
            ))}
          </div>
          {children}
        </div>
        <TeamMenu />
      </div>
    </div>
  );
}
