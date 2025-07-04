import { useRef, useState } from "react";
import { FaCheck, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import AsyncButton from "~/app/dashboard/components/buttons/async-button";
import { useAuthContext } from "~/app/context/auth-context";
import { avatars } from "~/lib/data/avatars";
import { apiRequest } from "~/lib/utils/api-request";
import UploadProfile from "./update-icon";

interface PopupPrompt {
  isVisible: boolean;
  isActive: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  togglePopup: () => void;
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditIcon = ({
  isVisible,
  isActive,
  ref,
  togglePopup,
  setDisable,
}: PopupPrompt) => {
  const { user } = useAuthContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.profile);
  const [useAvatar, setUseAvatar] = useState(true);

  const [selecting, setSelecting] = useState(false);
  const [profileBlob, setProfileBlob] = useState<Blob | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const updateProfile = async () => {
    if (!user) {
      return;
    }
    if (loading) {
      return;
    }
    if (!selectedAvatar) {
      setError("No Avatar Selected");
      return;
    }
    setLoading(true);
    setError("");
    setDisable(true);
    const formData = new FormData();

    formData.append("userId", user._id);
    if (useAvatar) {
      formData.append("selectedAvatar", selectedAvatar);
    } else {
      formData.append("uploaded_image", profileBlob as Blob);
    }

    await apiRequest({
      url: `/api/user/edit-icon`,
      method: "PATCH",
      body: formData,
      onSuccess: (response) => {
        setSuccessful(true);
        toast.success(response.message, {
          icon: <FaCheck color="white" />,
        });
        window.dispatchEvent(new CustomEvent("userUpdated"));
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

  const inputProfileRef = useRef<HTMLInputElement | null>(null);
  const handleClickSelect = () => inputProfileRef.current?.click();
  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelecting(true);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setProfileUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    isActive && (
      <div className="fixed top-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-40  px-8     xs:px-0  ">
        {selecting ? (
          <UploadProfile
            selecting={selecting}
            setSelecting={setSelecting}
            ref={ref}
            setProfilePreview={setProfilePreview}
            setProfileBlob={setProfileBlob}
            profileUrl={profileUrl}
            setProfileUrl={setProfileUrl}
          />
        ) : (
          <div
            className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg rounded-lg bg-fade-grey   items-center relative   z-40    isolation-auto   ${
              isVisible ? "" : "mid-popup-hidden"
            }`}
            ref={ref}
          >
            <div className="flex items-center flex-col gap-0 w-full leading-none">
              <h1 className="text-2xl sf-bold text-center text-white">
                {useAvatar ? "Choose An Avatar" : "Upload Image"}
              </h1>
              <p className="text-grey-blue text-center text-sm ">
                {useAvatar &&
                  "Select an avatar  to use as your profile picture"}
              </p>
            </div>
            {useAvatar ? (
              <div className="flex  items-center flex-wrap gap-2 ">
                {Object.entries(avatars).map(([color, url]) => (
                  // eslint-disable-next-line
                  <img
                    src={url}
                    alt={`${color} avatar`}
                    className={`w-12  h-12  rounded-full  cursor-pointer duration-150   ${
                      selectedAvatar === url
                        ? "ring-3  ring-powder-blue "
                        : "hover:ring  ring-powder-blue"
                    }`}
                    onClick={() => setSelectedAvatar(url)}
                    key={color}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center justify-center">
                {profilePreview ? (
                  // eslint-disable-next-line
                  <img
                    src={profilePreview}
                    alt="icon"
                    className="w-28  h-28  rounded-full "
                  />
                ) : (
                  <FaImage className="w-28  h-28  text-grey" />
                )}
                <button
                  className="h-[30px]  bg-grey  px-3 rounded-full hover:ring ring-powder-blue text-xs"
                  onClick={handleClickSelect}
                >
                  {profileUrl ? "Choose another" : "Select Image"}
                </button>
              </div>
            )}

            <button
              className="text-xs   text-center  hover:underline text-center text-silver-blue"
              onClick={() => {
                setError("");
                if (useAvatar) {
                  setUseAvatar(false);
                } else {
                  setUseAvatar(true);
                }
              }}
            >
              {useAvatar ? "Upload an Image?" : "Use an Avatar instead"}
            </button>
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
                action="Continue"
                disabled={
                  useAvatar
                    ? selectedAvatar === user?.profile
                    : !profileUrl?.trim()
                }
                loading={loading}
                success={successful}
                onClick={updateProfile}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileFileChange}
                ref={inputProfileRef}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default EditIcon;
