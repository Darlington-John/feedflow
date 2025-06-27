import { JSONContent } from "@tiptap/react";
export interface feedback_type {
  _id: string;
  by: {
    _id: string;
    username: string;
    profile: string;
    role?: string;
  };
  status: {
    type: string;
    marked_by: {
      _id: string;
      username: string;
      profile: string;
    };
    marked_at: string;
  };
  title: string;
  details: JSONContent | null;
  type: string;
  priority: number;
  likes: string[];
  dislikes: string[];
  team: string;
  createdAt: string;
  superAdminIds: string[];
  adminIds: string[];
}
