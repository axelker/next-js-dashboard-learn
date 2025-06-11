// Used for apply a loading and get streaming flux for the data.
// In overwiew for only apply loading for dashboard (not sub  routes customers,invoices).
import { CardsSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return <CardsSkeleton/>;
}