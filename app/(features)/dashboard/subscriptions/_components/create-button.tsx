'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export default function CreateButton({ planName }: { planName: string}) {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const handleSubscribe = async () => {
        setLoadingPlan(planName);
        const { error } = await authClient.subscription.upgrade({
            plan: planName,
            successUrl: '/dashboard',
            cancelUrl: '/dashboard/subscription',
        });
        setLoadingPlan(null);
        if (error) toast.error(error.message);
    };

    return (

        <Button
            onClick={() => handleSubscribe()}
            disabled={!!loadingPlan}
        >
            {loadingPlan
                    ? 'Processing...'
                    : `Subscribe to ${planName}`}
        </Button>
    );
}
