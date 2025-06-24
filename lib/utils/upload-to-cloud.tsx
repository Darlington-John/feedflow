import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(new Error("Upload failed. Please try again."));
          }

          if (!result || !result.secure_url) {
            return reject(
              new Error("Invalid upload response from Cloudinary.")
            );
          }

          resolve({ secure_url: result.secure_url });
        }
      );

      uploadStream.end(buffer);
    } catch (err) {
      console.error("Unexpected error uploading to Cloudinary:", err);
      reject(new Error("An unexpected error occurred during upload."));
    }
  });
}
