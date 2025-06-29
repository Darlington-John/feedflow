import { NextRequest, NextResponse } from "next/server";
import type { JSONContent } from "@tiptap/react";
import Feedback from "~/lib/models/feedback";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";
import { base64ToBuffer } from "~/lib/utils/base64-to-buffer";
import { uploadToCloudinary } from "~/lib/utils/upload-to-cloud";

async function processTipTapContent(
  content: JSONContent[]
): Promise<JSONContent[]> {
  return Promise.all(
    content.map(async (node) => {
      if (node.type === "image" && node.attrs?.src?.startsWith("data:image")) {
        const buffer = base64ToBuffer(node.attrs.src);
        const uploaded = await uploadToCloudinary(buffer, "feedbacks");
        return {
          ...node,
          attrs: {
            ...node.attrs,
            src: uploaded.secure_url,
          },
        };
      } else if (node.content) {
        const newContent = await processTipTapContent(node.content);
        return { ...node, content: newContent };
      }
      return node;
    })
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { team_id } = await params;
    const { title, type, userId, details, priority } = await req.json();

    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not provided" },
        { status: 404 }
      );
    }

    if (title.trim() === "") {
      return NextResponse.json(
        { error: "Title not provided" },
        { status: 404 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { error: "User Id not provided" },
        { status: 404 }
      );
    }

    const team = await Team.findById(team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
    if (!team.members.includes(userId)) {
      return NextResponse.json(
        { error: "Only Members are allowed to perform this action" },
        { status: 404 }
      );
    }
    const processedContent = await processTipTapContent(details.content);
    const newFeedback = await Feedback.create({
      title: title,
      type,
      by: userId,
      details: {
        ...details,
        content: processedContent,
      },
      priority,
      team: team_id,
    });

    const adminIds = team.admins.map((id) => id.toString());
    const superAdminIds = team.super_admins.map((id) => id.toString());

    return NextResponse.json(
      {
        message: "Feedback given",
        feedback: newFeedback,
        role: superAdminIds?.includes(userId)
          ? "super admin"
          : adminIds?.includes(userId)
          ? "admin"
          : "member",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
