import { NextRequest, NextResponse } from "next/server";
import Feedback from "~/lib/models/feedback";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { feedId, userId } = await req.json();
    const { team_id } = await params;

    if (!userId)
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 400 }
      );
    if (!feedId)
      return NextResponse.json(
        { error: "Feedback Id not  provided" },
        { status: 400 }
      );
    if (!team_id)
      return NextResponse.json(
        { error: "Team Id not  provided" },
        { status: 400 }
      );
    const team = await Team.findById(team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }

    const feedback = await Feedback.findById(feedId);
    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" });
    }
    const hasLiked = feedback.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      feedback.likes = feedback.likes.filter((id) => id.toString() !== userId);
    } else {
      feedback.likes.push(userId);
      feedback.dislikes = feedback.dislikes.filter(
        (id) => id.toString() !== userId
      );
    }
    await feedback.save();
    return NextResponse.json(
      {
        message: "Feedback liked",
        likes: feedback.likes.length,
        dislikes: feedback.dislikes.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: ' "Oops! An error occurred. Please try again later."' },
      { status: 500 }
    );
  }
}
