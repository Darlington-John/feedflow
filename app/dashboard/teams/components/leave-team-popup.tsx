import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import { useAuthContext } from "~/app/context/auth-context";
import { apiRequest } from "~/lib/utils/api-request";
import { team_type } from "~/lib/types/team";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/lib/redux/store";
import { deleteTeam } from "~/lib/redux/slices/teams";
import { useUtilsContext } from "~/app/context/utils-context";

interface PopupPrompt {
  isVisible: boolean;
  isActive: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  togglePopup: () => void;
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
  team: team_type | null;
}

const LeaveTeamPopup = ({
  isVisible,
  isActive,
  ref,
  togglePopup,
  setDisable,
  team,
}: PopupPrompt) => {
  const { user } = useAuthContext();
  const { team_id } = useParams();
  const { setRerenderKey } = useUtilsContext();
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const leaveTeam = async () => {
    if (!user) {
      return;
    }
    if (leaving) {
      return;
    }

    setLeaving(true);
    setError("");
    setDisable(true);
    await apiRequest({
      url: `/api/teams/${team_id}/leave-team`,
      method: "DELETE",
      body: { userId: user._id },
      onSuccess: (response) => {
        setSuccessful(true);
        toast.success(response.message, {
          icon: <FaCheck color="white" />,
        });
        dispatch(deleteTeam({ teamId: team_id as string }));
        router.push("/dashboard");
        setTimeout(() => {
          togglePopup();
          setSuccessful(false);
          setRerenderKey((prev) => prev + 1);
        }, 3000);
      },
      onError: (error) => {
        setError(error);
      },
      onFinally: () => {
        setLeaving(false);
        setDisable(false);
      },
    });
  };
  return (
    isActive && (
      <div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-40  px-8     xs:px-0">
        <div
          className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg rounded-lg bg-fade-grey   items-center      ${
            isVisible ? "" : "mid-popup-hidden"
          }`}
          ref={ref}
        >
          <div className="flex items-center flex-col gap-0 w-full leading-none">
            <h1 className="text-2xl sf-bold text-center text-white">
              Leaving This Team?
            </h1>
            <p className="text-grey-blue text-center text-sm ">
              {team?.super_admins.includes(user?._id as string)
                ? `As the super admin leving this team will lead to team deletion. Are you
              sure you want to continue?`
                : `You’ll be removed from the team and lose access. Are you sure you want to continue?`}
            </p>
          </div>

          {error && (
            <h1 className="text-[11px] neue-light text-red text-center">
              {error}
            </h1>
          )}
          <div className="gap-2 flex w-full">
            <AsyncButton
              classname_overide="!h-[40px] !rounded-md"
              action="Continue"
              loading={leaving}
              success={successful}
              onClick={leaveTeam}
            />
            <button
              className="bg-grey text-center w-full  hover:outline outline-light-grey   !rounded-md text-sm"
              onClick={togglePopup}
              disabled={leaving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default LeaveTeamPopup;
