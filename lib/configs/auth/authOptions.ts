import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { avatars } from "~/lib/data/avatars";

import User from "~/lib/models/users";

import connectMongo from "~/lib/mongodb";
const JWT_SECRET = process.env.JWT_SECRET as string;

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        await connectMongo();
        const avatarValues = Object.values(avatars); // get all the URLs
        const randomAvatar =
          avatarValues[Math.floor(Math.random() * avatarValues.length)];
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            profile: randomAvatar,
            oauthProvider: "google",
            isAdmin: false,
            username: user.name,
          });
        }

        token.id = existingUser._id;
        token.email = existingUser.email;
        token.oauthProvider = existingUser.oauthProvider;
        token.name = `${existingUser.username}`;
      }

      return token;
    },
    //eslint-disable-next-line
    session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
  },

  secret: JWT_SECRET,

  session: {
    strategy: "jwt",
  },
};

export default authOptions;
