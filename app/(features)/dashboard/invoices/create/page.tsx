import Form from '@/app/(features)/dashboard/invoices/create-form';
import { fetchCustomers } from '@/app/(features)/_services/data';
import Breadcrumbs from '@/app/(features)/dashboard/invoices/breadcrumbs';

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
      <Form customers={customers} />
    </main>
  );
}