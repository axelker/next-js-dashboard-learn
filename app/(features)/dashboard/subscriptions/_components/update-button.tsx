"use client";
import { Plan } from "@/lib/stripe-plan";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function UpdateButton({
	plan,
	subId,
}: {
	plan: Plan;
	subId: string;
}) {
	const [isPending, setIsPending] = useState(false);
	const handleSubscribe = async () => {
			setIsPending(true);
			const { error } = await authClient.subscription.upgrade({
				plan: plan.name,
				successUrl: '/dashboard/subscriptions',
				cancelUrl: '/dashboard/subscriptions',
				subscriptionId:subId
			});
			setIsPending(false);
			if (error) toast.error(error.message);
		};
	return (
        <Button onClick={handleSubscribe} disabled={isPending }>
            {isPending ? "Loading..." : "Switch to this plan"}
        </Button>
	);
}