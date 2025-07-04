import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import Feedback from "~/lib/models/feedback";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Please sign in to view your dashboard" },
        { status: 400 }
      );
    }
    const feedbacks = await Feedback.find({ by: userId });

    const totalFeedbacks = await Feedback.countDocuments({ by: userId });

    const totalTeams = await Team.countDocuments({ members: userId });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayFeedbacks = await Feedback.countDocuments({
      by: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    return NextResponse.json(
      {
        totalFeedbacks,
        todayFeedbacks,
        totalTeams,
        feedbacks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting feedback stats:", error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
