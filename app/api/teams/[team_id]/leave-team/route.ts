import { NextRequest, NextResponse } from "next/server";
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
        { error: "Team Id not defined" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User Id not defined" },
        { status: 400 }
      );
    }

    const team = await Team.findById(team_id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }

    const isMember = team.members.includes(userId);
    if (!isMember) {
      return NextResponse.json(
        { error: "You are not a member of the team" },
        { status: 400 }
      );
    }

    const isSuperAdmin = team.super_admins.includes(userId);

    if (isSuperAdmin) {
      await Team.findByIdAndUpdate(team_id, {
        $pull: { members: userId, super_admins: userId },
      });
      await Team.findByIdAndDelete(team_id);
      return NextResponse.json(
        { message: `You left ${team?.name} ` },
        { status: 200 }
      );
    }

    if (!isSuperAdmin) {
      await Team.findByIdAndUpdate(team_id, {
        $pull: { members: userId, admins: userId },
      });

      return NextResponse.json(
        { message: `You left ${team?.name} ` },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "A server error" }, { status: 500 });
  }
}
