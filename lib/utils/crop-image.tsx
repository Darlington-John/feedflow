// utils/cropImage.ts

type CropDimensions = {
  imageSrc: string;
  pixelCrop: { x: number; y: number; width: number; height: number };
  width: number;
  height: number;
};

export default function getCroppedImg({
  imageSrc,
  pixelCrop,
}: CropDimensions): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get 2D context"));
        return;
      }

      // Remove these lines if you don't want a red background
      // ctx.fillStyle = "red";
      // ctx.fillRect(0, 0, width, height);

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    };

    image.onerror = () => {
      reject(new Error("Image failed to load"));
    };
  });
}
