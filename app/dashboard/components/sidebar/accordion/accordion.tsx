"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import plus from "~/public/icons/plus.svg";
import commn from "~/public/icons/commn.svg";
import { useUtilsContext } from "~/app/context/utils-context";
import { useAuthContext } from "~/app/context/auth-context";
import { useDispatch, useSelector } from "react-redux";
import loadingGif from "~/public/images/esclipse.svg";
import { AppDispatch, RootState } from "~/lib/redux/store";
import {
  addMoreCommunities,
  setCommunities,
} from "~/lib/redux/slices/community-slice";
import Link from "next/link";
import { slugify } from "~/lib/utils/sluggify";
import { usePathname } from "next/navigation";
import AccordionItem from "./accd-list";
import { toast } from "react-toastify";
import AsyncButton from "../../buttons/async-button";
import { apiRequest } from "~/lib/utils/api-request";
import { recentComType } from "~/lib/types/recent-communities";

export const Accordion = () => {
  const [openIds, setOpenIds] = useState<(string | number)[]>([0, 1]);

  const toggleItem = (id: string | number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const resources = [
    { id: 1, resource: "communities", icon: commn },
    { id: 2, resource: "communities", icon: commn },
  ];

  const { toggleCreateCommunityPopup, toggleAuthPopup } = useUtilsContext();

  const dispatch = useDispatch<AppDispatch>();
  const communities = useSelector(
    (state: RootState) => state.communities.communities
  );
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [loadingCommunitiesError, setLoadingCommunitiesError] = useState("");
  const { user } = useAuthContext();
  const [communityCount, setCommunityCount] = useState<number | null>(null);
  const [rerenderKey, setRerenderKey] = useState(0);
  useEffect(() => {
    const fetchCommunities = async () => {
      setLoadingCommunities(true);
      await apiRequest({
        url: "/api/community/fetch-communities",
        method: "GET",
        onSuccess: (response) => {
          dispatch(setCommunities(response.communities));
          setCommunityCount(response.communities_count);
          setTimeout(() => setRerenderKey((prev) => prev + 1), 1000);
        },
        onError: (error) => {
          setLoadingCommunitiesError(error as string);
        },
        onFinally: () => {
          setLoadingCommunities(false);
        },
      });
    };

    fetchCommunities();
  }, [dispatch]);
  const [recentCommunities, setRecentCommunities] = useState<
    recentComType[] | null
  >(null);
  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchRecentCommunities = async () => {
      await apiRequest({
        url: `/api/community/fetch-recent-communities?userId=${user?._id}`,
        method: "GET",
        onSuccess: (response) => {
          setRecentCommunities(response.recent_communities);
          setTimeout(() => setRerenderKey((prev) => prev + 1), 1000);
        },
      });
    };

    fetchRecentCommunities();
    window.addEventListener("fetch_recent_communities", fetchRecentCommunities);

    return () => {
      window.removeEventListener(
        "fetch_recent_communities",
        fetchRecentCommunities
      );
    };
  }, [user]);

  const linkname = usePathname();
  const [skip, setSkip] = useState(communities?.length);
  const [showMore, setShowMore] = useState(
    (communityCount as number) > communities?.length
  );

  useEffect(() => {
    setSkip(communities?.length);
    setShowMore((communityCount as number) > communities?.length);
  }, [communities?.length, communityCount]);
  const [moreLoading, setMoreLoading] = useState(false);
  const [moreSuccess, setMoreSuccess] = useState(false);

  const loadMore = async () => {
    setMoreLoading(true);
    try {
      const res = await fetch(`/api/community/fetch-communities?skip=${skip}`);
      const data = await res.json();

      if (data.communities) {
        setMoreSuccess(true);
        setRerenderKey((prev) => prev + 1);
        dispatch(addMoreCommunities(data.communities));
        setTimeout(() => {
          setMoreSuccess(false);
        }, 2000);
      }
      const newSkip = skip + data.communities.length;
      setSkip(newSkip);
      setShowMore(newSkip < communities.length);
    } catch (err) {
      console.log(err);
      toast.error(`Could'nt fetch more communities`);
    } finally {
      setMoreLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col divide-y  divide-grey     ">
      {recentCommunities && recentCommunities?.length > 0 && (
        <AccordionItem
          isOpen={openIds.includes(0)}
          onClick={() => toggleItem(0)}
          rerenderKey={rerenderKey}
          header="Recent"
        >
          {recentCommunities &&
            recentCommunities.map((data, index) => (
              <Link
                href={`/${slugify(data.name)}`}
                className="flex items-center gap-2  pl-6 h-[40px] hover:bg-fade-grey rounded-lg"
                key={index}
              >
                {/* eslint-disable-next-line */}
                <img
                  src={data.photo}
                  className="w-8  h-8  rounded-full object-cover"
                  alt=""
                />
                <span className="line-clamp-1  text-sm  text-light-blue">
                  d/{data.name}
                </span>
              </Link>
            ))}
        </AccordionItem>
      )}

      {loadingCommunitiesError ? null : loadingCommunities ? (
        <div className="w-full py-2">
          <Image src={loadingGif} className="w-6 mx-auto" alt="" />
        </div>
      ) : (
        <AccordionItem
          isOpen={openIds.includes(1)}
          onClick={() => toggleItem(1)}
          header="Communities"
          rerenderKey={rerenderKey}
        >
          <button
            className="flex items-center gap-2  pl-6 h-[40px] hover:bg-fade-grey rounded-lg"
            onClick={user ? toggleCreateCommunityPopup : toggleAuthPopup}
          >
            <Image
              src={plus}
              className="w-5   rounded-full object-cover"
              alt=""
            />
            <span className="line-clamp-1  text-sm  text-light-blue">
              Create a community
            </span>
          </button>
          {communities &&
            communities.map((data) => (
              <Link
                href={`/${slugify(data.name)}`}
                className={`flex items-center gap-2  flex items-center gap-2  px-6 h-[40px]  rounded-lg  ${
                  linkname === `/${slugify(data.name)}`
                    ? "bg-grey"
                    : "hover:bg-fade-grey"
                }`}
                key={data._id}
              >
                {/* eslint-disable-next-line */}
                <img
                  src={data.photo}
                  className="w-8  h-8    rounded-full object-cover"
                  alt=""
                />
                <span className="line-clamp-1  text-sm  text-light-blue">
                  d/{data.name}
                </span>
              </Link>
            ))}
          {showMore && (
            <AsyncButton
              action="+View  more"
              loading={moreLoading}
              success={moreSuccess}
              classname_overide=" !h-[35px] text-xs !bg-transparent !text-start  !justify-start  hover:!bg-fade-grey !rounded-md px-6 !w-auto"
              onClick={loadMore}
              disabled={communityCount === communities.length}
            />
          )}
        </AccordionItem>
      )}

      <AccordionItem
        isOpen={openIds.includes(2)}
        onClick={() => toggleItem(2)}
        header="Resources"
      >
        {resources.map((data) => (
          <div
            className="flex items-center gap-2  pl-6 h-[40px] hover:bg-fade-grey rounded-lg"
            key={data.id}
          >
            <Image
              src={data.icon}
              className="w-5   rounded-full object-cover"
              alt=""
            />
            <span className="line-clamp-1  text-sm  text-light-blue">
              {data.resource}
            </span>
          </div>
        ))}
      </AccordionItem>
    </div>
  );
};
