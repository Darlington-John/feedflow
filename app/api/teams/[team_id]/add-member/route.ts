import { NextRequest, NextResponse } from "next/server";
import Team from "~/lib/models/teams";
import User from "~/lib/models/users";
import connectMongo from "~/lib/mongodb";
import { mailOptions, transporter } from "~/lib/nodemailer";

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

    // Try to find the user by email
    const user = await User.findOne({ email: memberEmail });

    if (user) {
      // Add existing user to the team
      team.members.push(user._id);
      await team.save();

      // Optionally, add this team to user's recent_teams list
      // user.recent_teams.push(team._id);
      // await user.save();

      return NextResponse.json(
        { message: "Member added successfully", newMemberId: user._id },
        { status: 200 }
      );
    } else {
      // Send invite email if the user doesn't exist
      await transporter.sendMail({
        ...mailOptions,
        to: memberEmail,
        subject: "Join Our App",
        html: `<p>You’ve been invited to join a team on [Your App]. <a href="https://your-app.com/invite/${team_id}">Click here to join</a></p>`,
      });

      return NextResponse.json(
        { message: "Invite email sent to user who is not on the app" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Add member error:", error);
    return NextResponse.json(
      { error: "A server error occurred" },
      { status: 500 }
    );
  }
}
