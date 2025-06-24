import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log("userId", userId);
    if (!userId) {
      return NextResponse.json(
        { error: "User Id not provided" },
        { status: 400 }
      );
    }

    const teams = await Team.find({ members: userId });

    return NextResponse.json(
      {
        result: teams,
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
