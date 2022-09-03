import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../../../util/db";

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

function EmailProvider(arg0: {
  server: string | undefined;
  from: string | undefined;
}): import("next-auth/providers").Provider {
  throw new Error("Function not implemented.");
}
