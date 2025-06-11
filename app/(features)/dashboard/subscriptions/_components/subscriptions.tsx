
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { plans } from '@/lib/stripe-plan';
import { Subscription } from "@better-auth/stripe";
import { formatDateToLocal } from '@/app/(features)/dashboard/_services/utils';
import CreateButton from './create-button';
import UpdateButton from './update-button';

export default function Subscriptions({ activeSub }: { activeSub: Subscription | null }) {

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrent = activeSub?.priceId === plan.priceId;
        return (
          <Card key={plan.id} className="p-6 flex flex-col justify-between h-full">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold capitalize">{plan.name}</h2>
              <p className="text-2xl font-bold">${plan.price.toFixed(2)}
                <span className="text-sm font-normal">/month</span>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>{plan.limits.projects} projects</li>
                <li>{plan.limits.storage} GB storage</li>
                <li>{isCurrent && (`Billing date: ${formatDateToLocal(activeSub?.periodEnd?.toISOString() ?? "")}`)}</li>
                <li>{activeSub?.cancelAtPeriodEnd ?? ''}</li>
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {activeSub?.priceId === plan.priceId ? (
								<>
									{activeSub.cancelAtPeriodEnd ? (
										<p className="text-red-400 text-xs">
											Your subscription will be cancelled on:{" "}
											{activeSub.periodEnd?.toLocaleDateString()}
										</p>
									) : (
										<p className="font-bold text-green-400">
											You are subscribed to this plan.
										</p>
									)}
								</>
							) : activeSub ? (
								<UpdateButton
									plan={plan}
									subId={activeSub.stripeSubscriptionId as string}
								/>
							) : (
								<CreateButton planName={plan.name} />
							)}

            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
