import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";
import { slugify } from "~/lib/utils/sluggify";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { teamName, teamDesc, userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "User Id not provided" },
        { status: 404 }
      );
    }
    if (teamName.trim() === "") {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 404 }
      );
    }

    const newTeam = await Team.create({
      name: teamName,
      description: teamDesc || "",
      team_slug: slugify(teamName),
      super_admins: [userId],
      members: [userId],
    });
    return NextResponse.json(
      {
        message: "Team created successfully",
        teamId: newTeam._id,
        newTeam,
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
