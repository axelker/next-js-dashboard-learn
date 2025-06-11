import { lusitana } from "@/app/fonts/fonts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Subscriptions from "@/app/(features)/dashboard/subscriptions/_components/subscriptions";

export default async function Page() {
  const activeSubs = await auth.api.listActiveSubscriptions({ headers: await headers() });
  const activeSub = activeSubs?.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing'
  );


  return (
    <>
      <div className="w-full items-center">
        <h1 className={`${lusitana.className} text-2xl`}>Subscriptions</h1>
        <Subscriptions activeSub={activeSub} />
      </div>
    </>
  )
}