import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "~/lib/mongodb";
import { mailOptions, transporter } from "~/lib/nodemailer";
import User from "~/lib/models/users";
import verification from "~/lib/models/verifications";
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { email, password, username } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already in use, login instead." },
        { status: 409 }
      );
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    const hashedVerificationCode = await bcrypt.hash(
      verificationCode.toString(),
      10
    );

    const existingVerification = await verification.findOne({ email });

    if (existingVerification) {
      await verification.updateOne(
        { email },
        {
          hashedCode: hashedVerificationCode,
          password: await bcrypt.hash(password, 10),
          username,
          oauthProvider: "local",
          createdAt: new Date(),
        }
      );
    } else {
      await verification.create({
        email,
        hashedCode: hashedVerificationCode,
        password: await bcrypt.hash(password, 10),
        username,
        oauthProvider: "local",
        createdAt: new Date(),
      });
    }

    await transporter.sendMail({
      ...mailOptions,
      to: email,
      text: "Hello. This email is for your email verification.",
      subject: "Welcome to feedflow,Verify Your Email",
      html: `<table
style="
  background-color: #1C3A4D;
  font-family: Arial, sans-serif;
  border-radius: 10px;
  max-width: 400px;
  margin: 10px auto;
  padding: 50px 30px;
"
>
<tr>
  <td align="center" style="padding-bottom: 10px;">
    <img
      src="https://res.cloudinary.com/dycw73vuy/image/upload/v1750624364/feedflow-ensuring-seamless-feedback-flow-06-22-2025_09_21_PM-removebg-preview_zqrnkr.png"
      style="width: 150px" alt="feedflow logo"
    />
  </td>
</tr>
<tr>
  <td
    style="
      border-top: 1px solid #DBE4E9;
      padding: 50px 15px;
      box-sizing: border-box;
      color: #DBE4E9;
    "
  >
    <p style="margin: 0; padding-bottom: 10px">Hello ${username},</p>
    <p
      style="
        font-size: 14px;
        font-weight: 300;
        line-height: 20px;
        margin: 0 0 20px 0;
      "
    >
    Thanks for signing up with feedflow! Before you get started, we need you to confirm your email address. Please copy this number below to complete your signup.
    </p>
  </td>
</tr>
<tr>
  <td align="center" style="padding: 10px 0">
    <p style="font-size: 40px; color: #DBE4E9; font-weight: bold; margin: 0">
      ${verificationCode}
    </p>
  </td>
</tr>
<tr>
  <td align="start" style="padding-top: 20px">
    <p style="font-size: 14px; color: #DBE4E9; margin: 0">© feedflow. ${new Date()}</p>
<p style="font-size:12px; color:gray;">
  You’re receiving this email from feedflow. <a href="#">Unsubscribe</a>
</p>
  </td>
</tr>
</table>`,
    });

    return NextResponse.json(
      { message: "Verification email sent successfully", email },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during signup." + error },
      { status: 500 }
    );
  }
}
