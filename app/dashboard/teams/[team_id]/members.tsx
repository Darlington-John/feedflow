import { FaPlus } from "react-icons/fa6";
import { useParams } from "next/navigation";
import logo from "~/public/images/logo.svg";
import Image from "next/image";
import Loader from "../../components/loader";
import { useAuthContext } from "~/app/context/auth-context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/lib/redux/store";
import { apiRequest } from "~/lib/utils/api-request";
import { addMoreMembers, setMembers } from "~/lib/redux/slices/members";
import { toast } from "react-toastify";
import AsyncButton from "../../components/buttons/async-button";
import MemberCard from "../components/member-card/member-card";
import MembersFilter from "../components/members-filter/members-filter";
const Members = () => {
  const { user, loading: fetchingUser } = useAuthContext();
  const { team_id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetchingError, setFetchingError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const members = useSelector((state: RootState) => state.members.members);

  const [membersCount, setMembersCount] = useState(0);
  useEffect(() => {
    if (fetchingUser) {
      return;
    }
    const fetchMembers = async () => {
      setLoading(true);
      await apiRequest({
        method: "GET",
        url: `/api/teams/${team_id}/fetch-members?userId=${user?._id}`,
        onSuccess: (res) => {
          dispatch(setMembers(res.result));
          setFetchingError(false);
          setMembersCount(res.Members_count);
        },
        onError: (error) => {
          setFetchError(error);
          setFetchingError(true);
        },
        onFinally: () => {
          setLoading(false);
        },
      });
    };

    fetchMembers();
  }, [dispatch, user?._id, team_id, user, fetchingUser]);
  const [skip, setSkip] = useState(members?.length);
  const [showMore, setShowMore] = useState(
    (membersCount as number) > members?.length
  );

  useEffect(() => {
    setSkip(members?.length);
    setShowMore((membersCount as number) > members?.length);
  }, [members?.length, membersCount]);
  const [moreMembersLoading, setMoreMembersLoading] = useState(false);
  const [moreMembersSuccess, setMoreMembersSuccess] = useState(false);
  const loadMoreMembers = async () => {
    setMoreMembersLoading(true);
    await apiRequest({
      method: "GET",
      url: `/api/teams/${team_id}/fetch-Members/fetch-more?skip=${skip}&userId=${user?._id}`,
      onSuccess: (res) => {
        setMoreMembersSuccess(true);
        const newMembers = res.result;
        const newSkip = skip + newMembers.length;
        setSkip(newSkip);
        setShowMore(newSkip < Members.length);
        dispatch(addMoreMembers(newMembers));

        setTimeout(() => {
          setMoreMembersSuccess(false);
        }, 2000);
      },
      onError: (error) => {
        console.log(error);
        toast.error(`Could'nt fetch more Members`);
      },
      onFinally: () => {
        setMoreMembersLoading(false);
      },
    });
  };

  const [selectedRole, setSelectedRole] = useState("All");

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
  };
  const filteredMembers = (() => {
    const filteredMembers = members?.filter((member) => {
      const roleMatch =
        selectedRole === "All" ||
        (selectedRole === "admin" && member.adminIds?.includes(member._id)) ||
        (selectedRole === "super admin" &&
          member.superAdminIds?.includes(member._id)) ||
        (selectedRole === "member" &&
          !member.adminIds?.includes(member._id) &&
          !member.superAdminIds?.includes(member._id));

      return roleMatch;
    });

    return filteredMembers;
  })();

  const areAllFiltersDefault = () => {
    const isRoleDefault = selectedRole === "All";
    return !!isRoleDefault;
  };

  return (
    <>
      <Loader
        fetching={loading || fetchingUser}
        errorFetching={fetchingError}
        error={fetchError}
      >
        <div className="flex items-start  w-full flex-col gap-2">
          <div className="flex items-center justify-between w-full  max-sm:py-2">
            {membersCount > 0 && (
              <h1 className="text-xl sf-light text-silver-blue  max-sm:text-lg">
                Total Members: {membersCount}
              </h1>
            )}

            <button
              className="flex items-center gap-1  bg-powder-blue  py-2 px-3 rounded-full  text-white hover:ring ring-white duration-150 text-sm  max-sm:py-1 self-end"
              //   onClick={() => {
              //     toggleMemberPopup();
              //   }}
            >
              <FaPlus className="text-xl max-sm:text-sm " />
              <h1 className="text-sm  ">Invite</h1>
            </button>
          </div>

          <div className="flex w-full items-center justify-between py-2">
            <MembersFilter
              filteredMembers={filteredMembers}
              areAllFiltersDefault={areAllFiltersDefault}
              setSelectedRole={setSelectedRole}
              selectedRole={selectedRole}
              handleRoleClick={handleRoleClick}
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full">
            {areAllFiltersDefault() ? (
              members && members?.length > 0 ? (
                members?.map((member) => (
                  <MemberCard member={member} key={member._id} />
                ))
              ) : (
                <div className="min-h-[50vh]  flex  items-center justify-center flex-col gap-2  mx-auto">
                  <Image src={logo} className="w-16" alt="logo" />
                  <h1 className="text-lg   text-center text-light-blue">
                    No Members yet
                  </h1>
                  <p className="text-[#4696dd] text-sm  w-72  text-center">
                    No members has made a Member yet... Once they do, their
                    Members will show up here
                  </p>
                </div>
              )
            ) : filteredMembers && filteredMembers?.length > 0 ? (
              filteredMembers?.map((member) => (
                <MemberCard member={member} key={member._id} />
              ))
            ) : (
              <div className="min-h-[50vh]  flex  items-center justify-center flex-col gap-2 mx-auto">
                <Image src={logo} className="w-16" alt="logo" />
                <h1 className="text-lg   text-center text-light-blue">
                  No Members match your filters
                </h1>
                <p className="text-[#4696dd] text-sm  w-72  text-center">
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
          {showMore && (
            <AsyncButton
              action="+View  more posts"
              loading={moreMembersLoading}
              success={moreMembersSuccess}
              classname_overide="max-w-34 !h-[30px] text-xs "
              onClick={loadMoreMembers}
              disabled={membersCount === members.length}
            />
          )}
        </div>
      </Loader>
    </>
  );
};

export default Members;
