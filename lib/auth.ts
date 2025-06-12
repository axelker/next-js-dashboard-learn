import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma-client";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe"
import { plans } from "@/lib/stripe-plan";
import Stripe from "stripe"

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-05-28.basil", 
})

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlit", ...etc
  }),
  user: {
        changeEmail: {
            enabled: true,
            //For update with verication email
            // sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
            //     await sendEmail({
            //         to: user.email, // verification email must be sent to the current user email to approve the change
            //         subject: 'Approve email change',
            //         text: `Click the link to approve the change: ${url}`
            //     })
            // }
        }
  },
  //For email verification
  // emailVerification: {
	// 	async sendVerificationEmail({ user, url }) {
	// 		const res = await resend.emails.send({
	// 			from,
	// 			to: to || user.email,
	// 			subject: "Verify your email address",
	// 			html: `<a href="${url}">Verify your email address</a>`,
	// 		});
	// 		console.log(res, user.email);
	// 	},
	// },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Need to activate for real APP
    //Reset password by email
    // async sendResetPassword({ user, url }) {
		// 	await resend.emails.send({
		// 		from,
		// 		to: user.email,
		// 		subject: "Reset your password",
		// 		react: reactResetPasswordEmail({
		// 			username: user.email,
		// 			resetLink: url,
		// 		}),
		// 	});
		// },
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
    stripe({
      subscription: {
        enabled: true,
        plans: plans
      },
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
    }),
    nextCookies(),

  ],
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
});

// Types for TypeScript
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;