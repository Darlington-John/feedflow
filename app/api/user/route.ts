import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectMongo from "~/lib/mongodb";
import User from "~/lib/models/users";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    //@ts-expect-error: type unknown
    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    //@ts-expect-error:type unknown
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Oops! An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
