import { Card } from '@/app/(features)/dashboard/_components/cards';
import RevenueChart from '@/app/(features)/dashboard/_components/revenue-chart';
import LatestInvoices from '@/app/(features)/dashboard/_components/latest-invoices';
import { lusitana } from '@/app/(features)/_shared/fonts';
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from '@/app/(features)/_services/data';
 
export default async function Page() {
  const revenue = await fetchRevenue();
  const {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices
  }= await fetchCardData();
  const latestInvoices = await fetchLatestInvoices();
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        { <Card title="Collected" value={totalPaidInvoices} type="collected" /> }
        { <Card title="Pending" value={totalPendingInvoices} type="pending" /> }
        { <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> }
        { <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> }
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
        { <LatestInvoices latestInvoices={latestInvoices} /> }
      </div>
    </main>
  );
}