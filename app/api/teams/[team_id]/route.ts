import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ team_id: string }>;
  }
) {
  try {
    const { team_id } = await params;
    await connectMongo();

    console.log("teamId", team_id);
    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not provided" },
        { status: 404 }
      );
    }
    const team = await Team.findById(team_id);
    if (!team) {
      return NextResponse.json(
        { error: `No Team found with the id ${team_id}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        result: team,
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
