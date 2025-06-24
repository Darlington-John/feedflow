import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectMongo from "~/lib/mongodb";
import User from "~/lib/models/users";

const JWT_SECRET = process.env.JWT_SECRET as string;
export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }
    if (user.oauthProvider === "google") {
      return NextResponse.json(
        {
          error:
            "This email is registered with Google. Please log in using Google or set a password.",
        },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Login successful" });
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
      { error: "An error occurred during login. " },
      { status: 500 }
    );
  }
}
