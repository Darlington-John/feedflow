import mongoose, { Model, Schema, Types } from "mongoose";
interface ITeam extends Document {
  name: string;
  description: string;
  members: Types.ObjectId[];
  icon: string;
  team_slug: string;
  super_admins: Types.ObjectId[];
  admins: Types.ObjectId[];
}
const teamSchema: Schema<ITeam> = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    team_slug: { type: String, required: false, unique: true },
    description: { type: String, required: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    super_admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    icon: { type: String, required: false },
  },
  { timestamps: true }
);

const Team: Model<ITeam> =
  mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);
export default Team;
export type { ITeam };
