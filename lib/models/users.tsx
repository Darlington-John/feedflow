import mongoose, { Model, Schema, Types } from "mongoose";
interface IUser extends Document {
  email: string;
  password?: string;
  username: string;
  profile: string;
  verificationHash?: string;
  oauthProvider: string;
  user_slug: string;
  recent_teams: Types.ObjectId[];
  recent_feedbacks: Types.ObjectId[];
  bio: string;
}
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    profile: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    user_slug: { type: String, required: true, unique: true },
    bio: { type: String, required: false },
    recent_teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
    recent_feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    password: { type: String, required: false },
    verificationHash: { type: String, required: false },
    oauthProvider: { type: String, required: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
export type { IUser };
