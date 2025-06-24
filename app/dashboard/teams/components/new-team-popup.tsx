"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiUserGroup } from "react-icons/hi";
import { toast } from "react-toastify";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import ClassicInput from "~/app/dashboard/components/inputs/classic-inputs";
import { useAuthContext } from "~/app/context/auth-context";
import { useUtilsContext } from "~/app/context/utils-context";
import { apiRequest } from "~/lib/utils/api-request";

interface props {
  newTeamPopup: boolean;
  newTeamPopupVisible: boolean;
  newTeamPopupRef: React.RefObject<HTMLDivElement | null>;
  toggleNewTeamPopup: () => void;
  disableNewTeamPopup: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewTeamPopup = ({
  newTeamPopup,
  newTeamPopupVisible,
  newTeamPopupRef,
  toggleNewTeamPopup,
  disableNewTeamPopup,
}: props) => {
  const { user } = useAuthContext();
  const { toggleAuthPopup } = useUtilsContext();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [sucessful, setSucessful] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const router = useRouter();
  const createTeam = async () => {
    if (!user) {
      toggleAuthPopup();
      return;
    }
    if (creating) {
      return;
    }
    if (teamName.trim() === "") {
      setError("Team name is required");
      return;
    }
    setCreating(true);
    setError("");
    disableNewTeamPopup(true);
    await apiRequest({
      url: "/api/teams/create-team",
      method: "POST",
      body: {
        teamName,
        teamDesc,
        userId: user._id,
      },
      onSuccess: (res) => {
        setSucessful(true);
        toast.success(res.message);
        setTimeout(() => {
          toggleNewTeamPopup();
          setTeamName("");
          setTeamDesc("");
          setSucessful(false);
          router.push(`/dashboard/teams/${res.teamId}`);
          toast.success("Redirecting");
        }, 1500);
      },
      onError: (error) => {
        setError(error);
      },
      onFinally: () => {
        disableNewTeamPopup(false);
        setCreating(false);
      },
    });
  };
  return (
    newTeamPopup && (
      <div
        className={`fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
      >
        <div
          className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg rounded-lg bg-fade-grey   items-center      ${
            newTeamPopupVisible ? "" : "mid-popup-hidden"
          }`}
          ref={newTeamPopupRef}
        >
          <div className="flex flex-col gap-3 items-center w-full">
            <div className="flex flex-col gap items-center  text-silver-blue">
              <HiUserGroup size={40} />
              <h1 className="text-2xl louize text-center">Create team</h1>
              <p className="text-sm neue-light  text-center">
                You&apos;re about to create a team. Members can collaborate and
                share resources.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <ClassicInput
              value={teamName}
              setValue={setTeamName}
              setError={setError}
              errorContent="Team name is required"
              error={error}
              label="Team name"
              // serverError={emailErrors}
            />
            <ClassicInput
              value={teamDesc}
              setValue={setTeamDesc}
              setError={setError}
              error={error}
              label="description (optional)"
              placeholder=""
              // serverError={emailErrors}
            />
          </div>
          {error && (
            <h1 className="text-[11px] neue-light text-red text-center">
              {error}
            </h1>
          )}
          <h1 className="text-[11px]  text-silver-blue">
            *You’ll be assigned as the super admin for creating the team. More
            details will be filled on the team page.
          </h1>
          <div className="flex gap-4 w-full">
            <AsyncButton
              loading={creating}
              success={sucessful}
              action="Create"
              onClick={createTeam}
              disabled={creating}
              classname_overide=" max-h-[40px] hover:ring  rounded-sm"
            />

            <button
              className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-grey-blue        duration-150 hover:ring hover:ring   ring-white         text-center w-[40%] text-white text-sm "
              onClick={toggleNewTeamPopup}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default NewTeamPopup;
