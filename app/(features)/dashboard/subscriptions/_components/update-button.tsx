"use client";
import { Plan } from "@/lib/stripe-plan";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const handleSubUpdate = async () => {
		try {
			setIsPending(true);
			const { error } = await authClient.subscription.upgrade({
				plan: plan.name,
				successUrl: '/dashboard/subscriptions',
				cancelUrl: '/dashboard/subscriptions',
			});
			
			if (error) {
				toast.error(error.message || "Failed to update subscription");
			} else {
				toast.success("Subscription updated successfully");
				setTimeout(() => {
					router.refresh();
				}, 3000);
			}
		} catch (err) {
			console.log(err);
			toast.error("An unexpected error occurred");
		} finally {
			setIsPending(false);
		}
	};
	return (
		<Button onClick={handleSubUpdate} disabled={isPending}>
			{isPending ? "Loading..." : "Switch to this plan"}
		</Button>
	);
}