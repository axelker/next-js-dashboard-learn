import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma-client";
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlit", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Need to activate for real APP
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins:[
    nextCookies(),
  ],
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
});

// Types for TypeScript
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;