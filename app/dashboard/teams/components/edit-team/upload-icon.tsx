"use client";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "~/lib/utils/crop-image";

interface Props {
  ref: React.RefObject<HTMLDivElement | null>;
  selecting: boolean;
  setSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  setProfilePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setProfileBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  profileUrl: string | null;
  setProfileUrl: React.Dispatch<React.SetStateAction<string | null>>;
}
const UploadProfile = ({
  selecting,
  setSelecting,
  ref,
  setProfilePreview,
  setProfileBlob,
  profileUrl,
  setProfileUrl,
}: Props) => {
  type Area = {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [profileCropPixels, setProfileCropPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      const image = new Image();
      const url = profileUrl;

      if (url) {
        image.src = url;
      } else {
        console.error("Image URL is null.");
      }

      image.onload = () => {
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const realCrop = {
          x: croppedAreaPixels.x * scaleX,
          y: croppedAreaPixels.y * scaleY,
          width: croppedAreaPixels.width * scaleX,
          height: croppedAreaPixels.height * scaleY,
        };

        setProfileCropPixels(realCrop);
      };
    },
    [profileUrl]
  );

  const showCroppedProfile = useCallback(async () => {
    if (!profileUrl || !profileCropPixels) return;
    const blob = await getCroppedImg({
      imageSrc: profileUrl,
      pixelCrop: profileCropPixels,
      width: 400,
      height: 400,
    });
    if (!blob) return;
    const previewUrl = URL.createObjectURL(blob);
    setProfilePreview(previewUrl);
    setProfileBlob(blob);
  }, [profileUrl, profileCropPixels, setProfilePreview, setProfileBlob]);

  const handleCancelCrop = () => {
    setSelecting(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setProfileUrl(null);
    setProfileCropPixels(null);
    setProfileBlob(null);
    setProfilePreview(null);
  };
  return (
    <div
      className={`w-[350px]  flex flex-col py-6 px-6  gap-4   rounded-lg rounded-lg bg-fade-grey   items-center`}
      ref={ref}
    >
      {selecting && (
        <div className="relative w-full h-[300px]">
          <Cropper
            image={profileUrl as string}
            crop={crop}
            zoom={zoom}
            aspect={400 / 400}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {selecting && (
        <div className="w-full items-center  justify-between flex ">
          <div className="flex gap-1 items-center mt-4">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
              className="bg-grey w-8   h-8   rounded-md "
            >
              -
            </button>
            <span className="text-sm  text-silver-blue">
              {zoom.toFixed(1)}x
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="bg-grey w-8   h-8   rounded-md "
            >
              +
            </button>
          </div>
          <div className="flex gap-2 ">
            <button
              onClick={() => handleCancelCrop()}
              className="bg-grey  px-3 py-2 text-white rounded text-xs  "
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showCroppedProfile();
                setSelecting(false);
              }}
              className="bg-powder-blue px-3 py-2 text-white rounded text-xs  "
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProfile;
