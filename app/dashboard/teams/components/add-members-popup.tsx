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

const AddMembersPopup = ({
  isVisible,
  isActive,
  ref,
  togglePopup,
  setDisable,
}: PopupPrompt) => {
  const { user } = useAuthContext();
  const { team_id } = useParams();
  const [memberEmail, setMemberEmail] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const addMember = async () => {
    if (!user) {
      return;
    }
    if (adding) {
      return;
    }
    if (!isValidEmail(memberEmail.trim().toLowerCase())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!memberEmail) {
      setError("Email is required");
      return;
    }
    setAdding(true);
    setError("");
    setDisable(true);
    await apiRequest({
      url: `/api/teams/${team_id}/add-member`,
      method: "POST",
      body: { userId: user._id, memberEmail },
      onSuccess: (response) => {
        setSuccessful(true);
        setMemberEmail("");
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
        setAdding(false);
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
              Invite members
            </h1>
            <p className="text-grey-blue text-center text-sm ">
              Enter the member&apos;s email here to either send an invite email
            </p>
          </div>
          <ClassicInput
            value={memberEmail}
            setValue={setMemberEmail}
            error={error}
            setError={setError}
            placeholder="Member's email"
            autofocus={true}
            errorContent={"Email is required "}
          />
          {error && (
            <h1 className="text-[11px] neue-light text-red text-center">
              {error}
            </h1>
          )}
          <div className="gap-2 flex w-full">
            <button
              className="bg-grey text-center w-full  hover:outline outline-light-grey   !rounded-md text-sm"
              onClick={togglePopup}
              disabled={adding}
            >
              Cancel
            </button>
            <AsyncButton
              classname_overide="!h-[40px] !rounded-md"
              action="Add"
              disabled={!memberEmail}
              loading={adding}
              success={successful}
              onClick={addMember}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default AddMembersPopup;
