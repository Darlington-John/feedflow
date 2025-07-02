import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { team_id } = await params;
    const { userId, memberId } = await req.json();

    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not provided" },
        { status: 400 }
      );
    }

    if (!memberId || memberId.trim() === "") {
      return NextResponse.json(
        { error: "MemberId not provided" },
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

    const isMember = team.members.includes(memberId);
    if (!isMember) {
      return NextResponse.json(
        { error: "This user is not a member of this team" },
        { status: 400 }
      );
    }

    await Team.findByIdAndUpdate(team_id, {
      $pull: { admins: memberId },
    });

    return NextResponse.json(
      { message: " Admin downgraded to member" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Downgrade member error:", error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
