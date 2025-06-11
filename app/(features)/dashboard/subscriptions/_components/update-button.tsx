"use client";
import { updateExistingSubscription } from "@/app/(features)/dashboard/subscriptions/_actions/sub";
import { Plan } from "@/lib/stripe-plan";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
			const result = await updateExistingSubscription(subId, plan.priceId);
			if (result.status) {
				toast.success(result.message || "Subscription updated successfully");
				setTimeout(() => {
					router.refresh();
				}, 2000);
			} else {
				toast.error(result.message || "Failed to update subscription");
			}
		} catch (err) {
            toast.error("An unexpected error occurred");
		} finally {
			setIsPending(false);
		}
	};
	return (
        <Button onClick={handleSubUpdate} disabled={isPending }>
            {isPending ? "Loading..." : "Switch to this plan"}
        </Button>
	);
}