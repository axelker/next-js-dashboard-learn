import Form from '@/app/(features)/dashboard/invoices/invoice-form';
import { fetchCustomers } from '@/app/(features)/_services/data';
import Breadcrumbs from '@/app/(features)/dashboard/invoices/breadcrumbs';
import { createInvoice } from '@/app/(features)/dashboard/invoices/_services/action';

export default async function Page () {
    const customers = await fetchCustomers();
    return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} action={createInvoice}/>
    </main>
  );
}