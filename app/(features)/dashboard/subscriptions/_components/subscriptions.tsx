'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { plans } from '@/lib/stripe-plan';
import { authClient } from '@/lib/auth-client';
import { Subscription } from '@better-auth/stripe';
import { formatDateToLocal } from '@/app/(features)/dashboard/_services/utils';

export default function Subscriptions({ activeSub }: { activeSub: Subscription | undefined }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  const handleSubscribe = async (planName: string) => {
    setLoadingPlan(planName);
    const { error } = await authClient.subscription.upgrade({
      plan: planName,
      successUrl: '/dashboard',
      cancelUrl: '/dashboard/subscription',
    });
    setLoadingPlan(null);
    if (error) toast.error(error.message);
  };

  const handleCancel = async () => {
    setCanceling(true);
    const { data, error } = await authClient.subscription.cancel({
      returnUrl: "/dashboard/subscriptions",
    });
    setCanceling(false);
    if (error) {
      toast.error(error.message);
    } else if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrent = activeSub?.priceId === plan.priceId;
        const isLoading = loadingPlan === plan.name;

        return (
          <Card key={plan.id} className="p-6 flex flex-col justify-between h-full">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold capitalize">{plan.name}</h2>
              <p className="text-2xl font-bold">${plan.price.toFixed(2)}</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>{plan.limits.projects} projects</li>
                <li>{plan.limits.storage} GB storage</li>
                <li>{isCurrent && (`Billing date: ${formatDateToLocal(activeSub?.periodEnd?.toISOString() ?? "")}`)}</li>
                <li>{activeSub?.cancelAtPeriodEnd ?? ''}</li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={isCurrent || isLoading}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : isLoading
                      ? 'Processing...'
                      : `Subscribe to ${plan.name}`}
                </Button>
                {isCurrent && activeSub && (
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleCancel}
                      disabled={canceling}
                    >
                      {canceling ? 'Canceling...' : 'Cancel Subscription'}
                    </Button>
                )}
            </CardFooter>
          </Card>
        );
      })}


    </div>
  );
}
