import { NextRequest, NextResponse } from "next/server";
import User from "~/lib/models/users";
import connectMongo from "~/lib/mongodb";
export async function PATCH(req: NextRequest) {
  try {
    await connectMongo();

    const { bio, userId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User  not authenticated" },
        { status: 404 }
      );
    }
    if (!bio) {
      return NextResponse.json({ error: "Bio not provided" }, { status: 404 });
    }
    user.bio = bio;

    await user.save();

    return NextResponse.json(
      { message: "Bio updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
