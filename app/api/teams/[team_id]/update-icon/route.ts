import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";
import { compressImage } from "~/lib/utils/compress-image";
import { uploadToCloudinary } from "~/lib/utils/upload-to-cloud";
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { team_id } = await params;
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = formData.get("userId") as any;
    const selectedAvatar = formData.get("selectedAvatar") as string;
    const uploaded_image = formData.get("uploaded_image") as Blob;

    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not provided" },
        { status: 404 }
      );
    }
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

    const team = await Team.findById(team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    if (!(team.admins.includes(userId) || team.super_admins.includes(userId))) {
      return NextResponse.json(
        { error: "Only Admins are allowed to perform this action" },
        { status: 404 }
      );
    }

    if (selectedAvatar) {
      team.icon = selectedAvatar;
      await team.save();
      return NextResponse.json(
        { message: "Team Icon updated successfully" },
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
      team.icon = upload.secure_url;
      await team.save();
      return NextResponse.json(
        { message: "Team Icon updated successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
