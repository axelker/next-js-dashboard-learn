'use client';

import { Subscription } from "@better-auth/stripe";
import CancelButton from '@/app/(features)/dashboard/subscriptions/_components/cancel-button';
import { plans } from "@/lib/stripe-plan";

interface SubscriptionInfoProps {
  subscription: Subscription;
}

export default function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const isCanceled : boolean | undefined = subscription.cancelAtPeriodEnd;
  const endDate: Date | undefined = subscription.periodEnd
  const price: number | undefined = plans.find((p) => p.priceId == subscription.priceId)?.price


  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Subscription Details</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Plan:</span>
          <span className="font-medium">{subscription.plan}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${
            subscription.status === 'active' ? 'text-green-600' : 
            subscription.status === 'trialing' ? 'text-blue-600' : 
            'text-red-600'
          }`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Period Ends:</span>
          <span className="font-medium">{endDate?.toLocaleDateString() || "N/A"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Price:</span>
          <span className="font-medium">
            ${ price ? price :"N/A"} /Month
          </span>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <CancelButton isAlreadyCanceling={!!isCanceled} />
      </div>
    </div>
  );
} 