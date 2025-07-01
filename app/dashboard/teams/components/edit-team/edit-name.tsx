import { useParams } from "next/navigation";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import ClassicInput from "~/app/dashboard/components/inputs/classic-inputs";
import { useAuthContext } from "~/app/context/auth-context";
import { apiRequest } from "~/lib/utils/api-request";

interface PopupPrompt {
  isVisible: boolean;
  isActive: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  togglePopup: () => void;
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTeamName = ({
  isVisible,
  isActive,
  ref,
  togglePopup,
  setDisable,
}: PopupPrompt) => {
  const { user } = useAuthContext();
  const { team_id } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const editName = async () => {
    if (!user) {
      return;
    }
    if (loading) {
      return;
    }
    if (!name) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    setError("");
    setDisable(true);
    await apiRequest({
      url: `/api/teams/${team_id}/edit-name`,
      method: "PATCH",
      body: { userId: user._id, name },
      onSuccess: (response) => {
        setSuccessful(true);
        setName("");
        toast.success(response.message, {
          icon: <FaCheck color="white" />,
        });

        window.dispatchEvent(new CustomEvent("refetchTeam"));
        setTimeout(() => {
          togglePopup();
          setSuccessful(false);
        }, 3000);
      },
      onError: (error) => {
        setError(error);
      },
      onFinally: () => {
        setLoading(false);
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
              Edit Team Name
            </h1>
            <p className="text-grey-blue text-center text-sm ">
              Enter new name below
            </p>
          </div>
          <ClassicInput
            value={name}
            setValue={setName}
            error={error}
            setError={setError}
            placeholder="New name"
            autofocus={true}
            errorContent="Name is required"
            serverError={["User  not authenticated"]}
          />
          {error && (
            <h1 className="text-[11px] neue-light text-red text-center">
              {error}
            </h1>
          )}
          <div className="gap-2 flex w-full">
            <button
              className="bg-grey text-center w-full  hover:outline outline-light-grey   !rounded-md"
              onClick={togglePopup}
              disabled={loading}
            >
              Cancel
            </button>
            <AsyncButton
              classname_overide="!h-[40px] !rounded-md"
              action="Edit"
              disabled={!name}
              loading={loading}
              success={successful}
              onClick={editName}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default EditTeamName;
