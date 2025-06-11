'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export default function CancelButton({ isAlreadyCanceling }: { isAlreadyCanceling: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    const { data, error } = await authClient.subscription.cancel({
      returnUrl: "/dashboard/subscriptions",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (data?.url) {
      window.location.href = data.url;
    }
  };

  const getButtonText = () => {
    if(isAlreadyCanceling) {
        return 'Subscription already cancelled.';
    }
    if (loading) {
        return 'Canceling...';
    }
    return 'Cancel Subscription';
  }

  return (
        <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleCancel}
            disabled={loading || isAlreadyCanceling}
        >
        {getButtonText()}
        </Button>
  );
}
