import { NextRequest, NextResponse } from "next/server";
import Feedback from "~/lib/models/feedback";
import User from "~/lib/models/users";
import connectMongo from "~/lib/mongodb";
import { team_type } from "~/lib/types/team";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId || userId.trim() === "") {
      return NextResponse.json(
        { error: "UserId not provided" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const feedbacks = await Feedback.find({ by: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "by",
        select: "username profile",
      })
      .populate({
        path: "status.marked_by",
        select: "username profile",
      })
      .populate({ path: "team", select: "super_admins  admins  icon  name" });
    const feedbacks_count = await Feedback.countDocuments({ by: userId });
    const feedbacksWithRole = feedbacks.map((fb) => {
      const feedbackObj = fb.toObject();
      const user = feedbackObj.by;
      // @ts-expect-error team-yeah yeah
      const team: team_type = feedbackObj.team;

      const userIdStr = user._id.toString();
      const adminIds = team.admins.map((id) => id.toString());
      const superAdminIds = team.super_admins.map((id) => id.toString());

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
