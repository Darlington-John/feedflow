import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuthContext } from "~/app/context/auth-context";
import { team_type } from "~/lib/types/team";
import { apiRequest } from "~/lib/utils/api-request";
import { usePageFetch } from "~/lib/utils/fetch-page-data";
import loadingGif from "~/public/images/esclipse.svg";
import AsyncButton from "../../components/buttons/async-button";
import { useUtilsContext } from "~/app/context/utils-context";
const Invite = () => {
  const { team_id } = useParams();
  const { user, loading } = useAuthContext();
  const { toggleAuthPopup } = useUtilsContext();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [successful, setSuccessful] = useState(false);
  const router = useRouter();
  const joinTeam = async () => {
    if (joining) {
      return;
    }
    if (!token) {
      setJoinError("No token provided");
      return;
    }
    localStorage.setItem("invite-token", token);

    if (!user) {
      toggleAuthPopup();
      return;
    }

    setJoining(true);
    setJoinError("");
    await apiRequest({
      url: `/api/teams/${team_id}/join`,
      method: "POST",
      body: { userId: user?._id, token },
      onSuccess: (response) => {
        setSuccessful(true);
        toast.success(response.message, {
          icon: <FaCheck color="white" />,
        });

        window.dispatchEvent(new CustomEvent("refetchTeam"));
        router.push(`/dashboard/teams/${team_id}?query=feedbacks`);
        setTimeout(() => {
          setSuccessful(false);
        }, 3000);
      },
      onError: (error) => {
        setJoinError(error);
      },
      onFinally: () => {
        setJoining(false);
      },
    });
  };
  const {
    fetchedData: team,
    isFetching,
    hasError,
    error,
  } = usePageFetch<team_type>({
    basePath: `/api/teams/${team_id}`,
    dep: user,
  });
  return (
    <Suspense>
      <div className="flex flex-col py-5">
        {hasError ? (
          <div className="flex h-[200px] items-center justify-center ">
            <div className="flex flex-col gap-1">
              <p className=" text-xl text-white      spaced leading-none ">
                Oops! We ran into a server error.
              </p>
              <p className="text-sm  normal-case  tracking-normal text-silver-blue line-clamp-3">
                {error}
              </p>
            </div>
          </div>
        ) : isFetching ? (
          <div className="w-full h-32 items-center justify-center flex ">
            <Image className="w-6" src={loadingGif} alt="loading" />
          </div>
        ) : (
          <div className="flex flex-col w-[350px]  bg-fade-grey p-4 rounded-2xl gap-3">
            <h1 className="text-2xl  sf-thin uppercase ">Welcome!</h1>
            <p className="text-sm text-silver-blue ">
              You’ve been invited to join the team! Join below to accept your
              invitation and start collaborating.
              <br />-{team?.name}
            </p>

            {joinError && (
              <h1 className="text-[11px] neue-light text-red text-center">
                {joinError}
              </h1>
            )}
            <AsyncButton
              classname_overide="bg-powder-blue !text-sm p-2 rounded-sm !h-[40px]"
              action="Join"
              disabled={joining || loading}
              loading={joining}
              success={successful}
              onClick={joinTeam}
            />
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default Invite;
