import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../../../util/db";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  // Configure one or more authentication providers
  providers: [
    // add email provider later
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },

      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    GithubProvider({
      // @ts-ignore
      clientId: process.env.GITHUB_CLIENT_ID,
      // @ts-ignore
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  debug: true,
};

export default NextAuth(nextAuthOptions);
