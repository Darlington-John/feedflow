export interface user_type {
  _id: string;
  email: string;
  password?: string;
  username: string;
  profile: string;
  verificationHash?: string;
  oauthProvider: string;
  recent_teams: string[];
  recent_feedbacks: string[];
  bio: string;
  createdAt: string;
  updatedAt: string;
}
