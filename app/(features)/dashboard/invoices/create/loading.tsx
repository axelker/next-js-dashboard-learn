// Used for apply a loading and get streaming flux for the data.
// In overwiew for only apply loading for dashboard (not sub  routes customers,invoices).
import { CardSkeleton } from "@/app/(features)/_shared/components/skeletons";

export default function Loading() {
  return <CardSkeleton/>;
}