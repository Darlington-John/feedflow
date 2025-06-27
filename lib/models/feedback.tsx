import mongoose, { Model, Schema, Types } from "mongoose";
import type { JSONContent } from "@tiptap/react";
interface IFeedback extends Document {
  by: Types.ObjectId;
  title: string;
  details: JSONContent;
  type: string;
  priority: number;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  team: Types.ObjectId;
  status: IStatus;
}
interface IStatus {
  type: "under review" | "in progress" | "completed" | "declined";
  marked_by: Types.ObjectId;
  marked_at: Date;
}
const StatusSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["under review", "in progress", "completed", "declined"],
      required: false,
    },
    marked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    marked_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);
const FeedbackSchema: Schema<IFeedback> = new mongoose.Schema(
  {
    by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    details: { type: Schema.Types.Mixed, required: true },
    type: { type: String, enum: ["bug", "idea", "feature"], required: true },
    status: {
      type: StatusSchema, // Now it's a subdocument
      required: false,
    },
    priority: { type: Number, required: true, default: 1 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
export default Feedback;
export type { IFeedback };
