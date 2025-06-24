import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongo from "~/lib/mongodb";
import { mailOptions, transporter } from "~/lib/nodemailer";
import User from "~/lib/models/users";

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    const hashedVerificationCode = await bcrypt.hash(
      verificationCode.toString(),
      10
    );

    user.verificationHash = hashedVerificationCode;
    await user.save();

    await transporter.sendMail({
      ...mailOptions,
      to: email,
      subject: "Your Password Reset Code",
      html: `
<table
style="
  background-color:  #1C3A4D;
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
      style="width: 200px"
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
    <p style="margin: 0; padding-bottom: 10px">Trouble signing in?</p>
    <p
      style="
        font-size: 14px;
        font-weight: 300;
        line-height: 20px;
        margin: 0 0 20px 0;
      "
    >
      Resetting your password is easy.
      <br />
      Just copy the verification code below and follow the instructions. We’ll
      have you up and running in no time.
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
    <p style="font-size: 14px; color: #DBE4E9; margin: 0">© feedflow. 2025</p>
    <p style="font-size:12px; color:gray;">
  You’re receiving this email from feedflow. <a href="#">Unsubscribe</a>
</p>
  </td>
</tr>
</table>
      `,
    });

    return NextResponse.json(
      {
        message: "Reset email sent, if the email exists.",
        email: email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Oops! An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
