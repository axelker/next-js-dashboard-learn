import { createAuthClient } from "better-auth/react"
import { stripeClient } from "@better-auth/stripe/client"

export const authClient = createAuthClient({
   
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    plugins: [
        stripeClient({
            subscription: true //if you want to enable subscription management
        })
    ]
})