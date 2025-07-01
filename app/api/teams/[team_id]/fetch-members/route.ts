import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { team_id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "UserId not provided" },
        { status: 400 }
      );
    }

    if (!team_id) {
      return NextResponse.json(
        { error: "TeamId not provided" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    // ✅ Properly populating members
    const team = await Team.findById(team_id)
      .populate({
        path: "members",
        select: "profile username email  createdAt", // customize as needed
      })
      .lean();

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user is a member
    const isMember = team.members.some(
      (member) => member._id.toString() === userId.toString()
    );

    if (!isMember) {
      return NextResponse.json(
        { error: "Only Members are allowed to view this info" },
        { status: 403 }
      );
    }

    const adminIds = team.admins.map((id) => id.toString());
    const superAdminIds = team.super_admins.map((id) => id.toString());

    const membersWithRoles = team.members.map((member) => {
      const memberIdStr = member._id.toString();

      let role = "member";
      if (superAdminIds.includes(memberIdStr)) {
        role = "super admin";
      } else if (adminIds.includes(memberIdStr)) {
        role = "admin";
      }

      return {
        ...member,
        role,
        adminIds,
        superAdminIds,
      };
    });

    return NextResponse.json(
      {
        message: "Team members fetched successfully",
        result: membersWithRoles,

        members_count: membersWithRoles.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FETCH_TEAM_MEMBERS_ERROR]", error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
