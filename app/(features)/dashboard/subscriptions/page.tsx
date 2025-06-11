import { lusitana } from "@/app/fonts/fonts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Subscriptions from "@/app/(features)/dashboard/subscriptions/_components/subscriptions";
import { getActiveSubscription } from "@/app/(features)/dashboard/subscriptions/_actions/sub";
import { toast } from "sonner";

export default async function Page() {
  const activeSub = await getActiveSubscription()
  if (!activeSub.status && activeSub.message) {
    toast.error(activeSub.message)
  }
  return (
    <>
      <div className="w-full items-center">
        <h1 className={`${lusitana.className} text-2xl`}>Subscriptions</h1>
        <Subscriptions activeSub={activeSub.subscription} />
      </div>
    </>
  )
}