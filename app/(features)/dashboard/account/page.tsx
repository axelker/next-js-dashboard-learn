import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PasswordForm } from "@/app/(features)/dashboard/account/_components/password-form";
import { EmailForm } from "@/app/(features)/dashboard/account/_components/email-form";
import { getActiveSubscription } from "@/app/(features)/dashboard/subscriptions/_actions/sub";
import SubscriptionInfo from "@/app/(features)/dashboard/account/_components/subscription-info";
import { prisma } from '@/lib/prisma-client';

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { subscription } = await getActiveSubscription();

  if (!session) {
    return null;
  }

  // Get the user's account to check the provider
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id
    },
    select: {
      providerId: true
    }
  });
  const isExternalProvider:boolean = account?.providerId !== 'credential';

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <div className="grid gap-6 md:grid-cols-1">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{session.user.name || "Not set"}</span>
              </div>
              <EmailForm 
                currentEmail={session.user.email} 
                isExternalProvider={isExternalProvider}
              />
            </div>
          </div>
          <div>
            {!isExternalProvider && <PasswordForm />}
          </div>
          {subscription && <SubscriptionInfo subscription={subscription} />}
        </div>
      </div>
    </main>
  );
} 