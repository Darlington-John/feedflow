import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectMongo from "~/lib/mongodb";
import User from "~/lib/models/users";
import { slugify } from "~/lib/utils/sluggify";
import verification from "~/lib/models/verifications";
import { avatars } from "~/lib/data/avatars";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { email, verificationCode } = await req.json();

    const verificationRecord = await verification.findOne({ email });
    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Verification record not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(
      verificationCode,
      verificationRecord.hashedCode
    );
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }
    const avatarValues = Object.values(avatars); // get all the URLs
    const randomAvatar =
      avatarValues[Math.floor(Math.random() * avatarValues.length)];
    const newUser = await User.create({
      email,
      password: verificationRecord.password,
      username: verificationRecord.username,
      oauthProvider: "local",
      verifiedAt: new Date(),
      profile: randomAvatar,
      user_slug: slugify(verificationRecord.username),
    });

    await verification.deleteOne({ email });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const response = NextResponse.json({
      message: "Email verified and account created",
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
      { error: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}
