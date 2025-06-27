import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import User from "~/lib/models/users";
import connectMongo from "~/lib/mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { token, userId } = await req.json();
    const { team_id } = await params;
    jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const team = await Team.findById(team_id);
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }
    const isAlreadyMember = team.members.includes(userId);

    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "You are already a member of this team" },
        { status: 409 }
      );
    }

    await Team.findByIdAndUpdate(team_id, {
      $addToSet: { members: user._id },
    });

    return NextResponse.json(
      { message: "You’ve joined the team!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid or expired invite link" },
      { status: 400 }
    );
  }
}
