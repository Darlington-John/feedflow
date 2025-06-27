import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import connectMongo from "~/lib/mongodb";
import { mailOptions, transporter } from "~/lib/nodemailer";
import jwt from "jsonwebtoken";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ team_id: string }> }
) {
  try {
    await connectMongo();
    const { team_id } = await params;
    const { memberEmail, userId } = await req.json();

    if (!team_id) {
      return NextResponse.json(
        { error: "Team Id not provided" },
        { status: 400 }
      );
    }

    if (!memberEmail || memberEmail.trim() === "") {
      return NextResponse.json(
        { error: "Email not provided" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User Id not provided" },
        { status: 400 }
      );
    }

    const team = await Team.findById(team_id).populate("members", "email");

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const isAuthorized =
      team.admins.includes(userId) || team.super_admins.includes(userId);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Only Admins are allowed to perform this action" },
        { status: 403 }
      );
    }

    const isAlreadyMember = team.members.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (member: any) => member.email === memberEmail
    );

    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "This person is already a member of the team" },
        { status: 409 }
      );
    }

    const inviteToken = jwt.sign(
      {
        email: memberEmail,
        team_id: team._id,
        type: "team-invite",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "3d" }
    );
    const inviteLink = `http://localhost:3000/dashboard/teams/${team_id}?query=invite&token=${inviteToken}`;
    await transporter.sendMail({
      ...mailOptions,
      to: memberEmail,
      subject: "Join Our App",
      html: `<p>You’ve been invited to join a team (${team?.name}) on FeedFlow. <a href="${inviteLink}">Click here to join</a></p>`,
    });

    return NextResponse.json(
      { message: "Invite email sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add member error:", error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
