import { NextRequest, NextResponse } from "next/server";
import Feedback from "~/lib/models/feedback";
import Team from "~/lib/models/teams";
import User from "~/lib/models/users";
import connectMongo from "~/lib/mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { team_id } = await params;
    const { userId, feedId, status } = await req.json();
    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not defined" },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { error: "Team Id not defined" },
        { status: 400 }
      );
    }
    if (!feedId) {
      return NextResponse.json(
        { error: "Feedback Id not defined" },
        { status: 400 }
      );
    }
    if (!status) {
      return NextResponse.json(
        { error: "Status not defined" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 400 });
    }

    const team = await Team.findById(team_id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }
    if (!(team.admins.includes(userId) || team.super_admins.includes(userId))) {
      return NextResponse.json(
        { error: "Only Admins are allowed to perform this action" },
        { status: 404 }
      );
    }
    const feedback = await Feedback.findByIdAndUpdate(feedId, {
      status: {
        type: status,
        marked_by: userId,
        marked_at: Date.now(),
      },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Feedback marked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occurred",
      },
      { status: 500 }
    );
  }
}
