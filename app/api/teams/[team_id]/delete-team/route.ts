import { NextRequest, NextResponse } from "next/server";
import Feedback from "~/lib/models/feedback";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { team_id } = await params;
    const { userId } = await req.json();

    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not provided" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User Id not provided" },
        { status: 400 }
      );
    }

    const team = await Team.findById(team_id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const isAuthorized = team.super_admins.includes(userId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Only Super admins are allowed to perform this action" },
        { status: 403 }
      );
    }

    await Feedback.deleteMany({ team: team_id });

    await Team.findByIdAndDelete(team_id);

    return NextResponse.json(
      { message: "Team and related feedbacks deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Team error:", error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
