import Pagination from '@/app/(features)/dashboard/invoices/_components/pagination';
import Search from '@/components/ui/search';
import Table from '@/app/(features)/dashboard/invoices/_components/table';
import { CreateInvoice } from '@/app/(features)/dashboard/invoices/_components/buttons';
import { lusitana } from '@/app/fonts/fonts';
import { InvoicesTableSkeleton } from '@/components/ui/skeletons';
import { fetchInvoicesPages } from '@/app/(features)/dashboard/_services/data';
import { Suspense } from 'react';


// Props automaticly inject by next js for get search url params.
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}