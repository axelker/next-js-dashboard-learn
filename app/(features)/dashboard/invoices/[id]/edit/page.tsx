import Form from '@/app/(features)/dashboard/invoices/_components/invoice-form';
import Breadcrumbs from '@/app/(features)/dashboard/invoices/_components/breadcrumbs';
import { fetchCustomers,fetchInvoiceById } from '@/app/(features)/dashboard/_services/data';
import { notFound } from 'next/navigation';
import { updateInvoice } from '@/app/(features)/dashboard/invoices/_services/action';
import { InvoiceFormType } from '@/app/(features)/dashboard/_types/definitions';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [customers,invoice] = await Promise.all([
      fetchCustomers(), 
      fetchInvoiceById(id)
  ]);

  if (!invoice) {
    notFound();
  }

  const action = updateInvoice.bind(null,invoice.id);
  
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
      <Form invoice={invoice as InvoiceFormType} customers={customers} action={action}/>
    </main>
  );
}