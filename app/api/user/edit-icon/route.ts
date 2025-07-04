import { NextRequest, NextResponse } from "next/server";
import User from "~/lib/models/users";
import connectMongo from "~/lib/mongodb";
import { compressImage } from "~/lib/utils/compress-image";
import { uploadToCloudinary } from "~/lib/utils/upload-to-cloud";
export async function PATCH(req: NextRequest) {
  try {
    await connectMongo();
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = formData.get("userId") as any;
    const selectedAvatar = formData.get("selectedAvatar") as string;
    const uploaded_image = formData.get("uploaded_image") as Blob;

    if (
      !selectedAvatar &&
      (!(uploaded_image instanceof File) || uploaded_image.size === 0)
    ) {
      return NextResponse.json(
        { error: "Either an avatar or an uploaded image must be used" },
        { status: 404 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User  Id not provided" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (selectedAvatar) {
      user.profile = selectedAvatar;
      await user.save();
      return NextResponse.json(
        { message: "User Profile updated successfully" },
        { status: 200 }
      );
    }

    if (uploaded_image instanceof File || uploaded_image.size > 0) {
      const MAX_IMAGE_MB = 0.3;
      const imageBuffer = await compressImage(
        await uploaded_image.arrayBuffer(),
        {
          format: "png",
          width: 400,
          height: 400,
          maxSizeMB: MAX_IMAGE_MB,
        }
      );
      const upload = await uploadToCloudinary(imageBuffer, "darlix_images");
      user.profile = upload.secure_url;
      await user.save();
      return NextResponse.json(
        { message: "User Icon updated successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
