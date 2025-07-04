import { NextRequest, NextResponse } from "next/server";
import Feedback from "~/lib/models/feedback";
import Team from "~/lib/models/teams";
import User from "~/lib/models/users";
import connectMongo from "~/lib/mongodb";

export async function DELETE(req: NextRequest) {
  try {
    await connectMongo();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User Id not provided" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // 1. Delete all feedbacks by the user
    await Feedback.deleteMany({ by: userId });

    // 2. Delete teams where the user is a super admin
    await Team.deleteMany({ super_admins: userId });

    // 3. Remove user from remaining teams (as member or admin)
    await Team.updateMany({ members: userId }, { $pull: { members: userId } });

    await Team.updateMany({ admins: userId }, { $pull: { admins: userId } });

    await Team.updateMany(
      { super_admins: userId },
      { $pull: { super_admins: userId } }
    );

    // 4. Delete the user account
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      { message: "User account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Account error:", error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
