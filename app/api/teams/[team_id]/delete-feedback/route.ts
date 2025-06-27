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
    const { userId, feedId } = await req.json();
    const { team_id } = await params;
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
    if (!feedId) {
      return NextResponse.json(
        { error: "Feedback Id not provided" },
        { status: 400 }
      );
    }
    const team = await Team.findById(team_id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }
    const feedback = await Feedback.findById(feedId);
    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 400 }
      );
    }

    if (
      !(
        team.admins.includes(userId) ||
        team.super_admins.includes(userId) ||
        feedback.by === userId
      )
    ) {
      return NextResponse.json(
        { error: "Access restricted to admins or feedback creator." },
        { status: 404 }
      );
    }

    const deleteFeedback = await Feedback.findByIdAndDelete(feedId);

    if (!deleteFeedback) {
      return NextResponse.json(
        { error: "Feedback not deleted" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Feedback deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "A server error occured" },
      { status: 500 }
    );
  }
}
