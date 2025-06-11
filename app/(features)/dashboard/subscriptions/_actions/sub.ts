"use server";

import { auth } from "@/lib/auth";
import { stripeClient } from "@/lib/auth";
import { Subscription } from "@better-auth/stripe";
import { headers } from "next/headers";
import { plans } from "@/lib/stripe-plan";


export async function getActiveSubscription(): Promise<{ status: boolean, message?: string, subscription: Subscription | null }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      status: false,
      message: "You need to be logged in.",
      subscription: null
    }
  }

  try {
    const activeSubs = await auth.api.listActiveSubscriptions({ headers: await headers() });
    const activeSub = activeSubs.length > 1 ?
      activeSubs.find(sub => sub.status === "active" || sub.status === "trialing") : activeSubs[0];
    return {
      subscription: activeSub ?? null,
      status: true
    }
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "Something went wrong.",
      subscription: null
    }
  }
}

export async function updateExistingSubscription(subId: string, switchToPriceId: string): Promise<{ status: boolean, message: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      status: false,
      message: "You need to be logged in.",
    }
  }

  if (!subId || !switchToPriceId) {
    return {
      status: false,
      message: "Invalid parameters."
    }
  }

  try {
    const subscription = await stripeClient.subscriptions.retrieve(subId);
    if (!subscription.items.data.length) {
      return {
        status: false,
        message: "Invalid subscription. No subscription items found!"
      }
    }

    // Update in Stripe
    const updatedSubscription = await stripeClient.subscriptions.update(subId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: switchToPriceId
        }
      ],
      cancel_at_period_end: false,
      proration_behavior: "create_prorations"
    });
    
    // Find the plan from our configuration
    const plan = plans.find(p => p.priceId === switchToPriceId);
    console.log(plan)
    if (!plan) {
      throw new Error("Plan not found in configuration");
    }

    // Update in your database using better-auth
    await auth.api.upgradeSubscription({
      headers: await headers(),
      body: {
        plan: plan.name,
        metadata: {
          priceId: switchToPriceId
        }
      }
    });

    return {
      status: true,
      message: "Subscription updated successfully!"
    }
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      status: false,
      message: "Something went wrong while updating the subscription."
    }
  }
}