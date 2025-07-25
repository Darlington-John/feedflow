import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Feedback from "~/lib/models/feedback";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { team_id } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: "UserId not provided" },
        { status: 400 }
      );
    }
    if (!team_id) {
      return NextResponse.json(
        { error: "TeamId not provided" },
        { status: 400 }
      );
    }

    const team = await Team.findById(team_id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }

    if (!team.members.includes(new mongoose.Types.ObjectId(userId))) {
      return NextResponse.json(
        { error: "Only Members are allowed to view feedbacks" },
        { status: 404 }
      );
    }
    const feedbacks = await Feedback.find({ team: team_id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "by",
        select: "username profile",
      })
      .populate({
        path: "status.marked_by",
        select: "username profile",
      });
    const feedbacks_count = await Feedback.countDocuments({ team: team_id });
    const adminIds = team.admins.map((id) => id.toString());
    const superAdminIds = team.super_admins.map((id) => id.toString());

    const feedbacksWithRole = feedbacks.map((fb) => {
      const feedbackObj = fb.toObject();
      const user = feedbackObj.by;

      const userIdStr = user._id.toString();

      let role = "member";
      if (superAdminIds.includes(userIdStr)) {
        role = "super admin";
      } else if (adminIds.includes(userIdStr)) {
        role = "admin";
      }

      return {
        ...feedbackObj,
        by: {
          ...user,
          role,
        },
        adminIds,
        superAdminIds,
      };
    });

    return NextResponse.json(
      {
        message: "Feedbacks fetched",
        result: feedbacksWithRole,
        feedbacks_count: feedbacks_count,
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
