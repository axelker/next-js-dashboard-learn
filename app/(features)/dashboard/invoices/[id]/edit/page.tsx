import Form from '@/app/(features)/dashboard/invoices/edit-form';
import Breadcrumbs from '@/app/(features)/dashboard/invoices/breadcrumbs';
import { fetchCustomers,fetchInvoiceById } from '@/app/(features)/_services/data';
import { notFound } from 'next/navigation';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [customers,invoice] = await Promise.all([
      fetchCustomers(), 
      fetchInvoiceById(id)
    ]);

console.log(invoice)
  if (!invoice) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}