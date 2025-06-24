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
    const { userId, description } = await req.json();

    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not provided" },
        { status: 404 }
      );
    }

    if (description.trim() === "") {
      return NextResponse.json(
        { error: "Description not provided" },
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
    if (!(team.admins.includes(userId) || team.super_admins.includes(userId))) {
      return NextResponse.json(
        { error: "Only Admins are allowed to perform this action" },
        { status: 404 }
      );
    }
    const editTeam = await Team.findByIdAndUpdate(
      team_id,
      { description: description },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Team description updated",
        description: editTeam?.description,
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
