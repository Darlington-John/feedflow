import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "~/lib/mongodb";
import jwt from "jsonwebtoken";
import User from "~/lib/models/users";

const JWT_SECRET = process.env.JWT_SECRET as string;
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist." },
        { status: 404 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.oauthProvider = "local";
    user.verificationHash = undefined;

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Password updated successfully.",
    });
    response.cookies.set({
      name: "token",
      value: token,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while updating the password." },
      { status: 500 }
    );
  }
}
