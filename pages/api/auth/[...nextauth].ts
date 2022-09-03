import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../../../util/db";
import EmailProvider from "next-auth/providers/email"

export const nextAuthOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    })
  ],
  adapter: PrismaAdapter(db),
};

export default NextAuth(nextAuthOptions);


