import Form from '@/app/(features)/dashboard/invoices/create-form';
import { fetchCustomers } from '@/app/(features)/_services/data';

export default async function Page () {
    const customers = await fetchCustomers();
    return (
        <Form customers={customers}></Form>
    )
}