import { fetchFilteredCustomers } from "@/app/(features)/_services/data"
import CustomersTable from "./table";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const customers = await fetchFilteredCustomers(query);
    return (
        <CustomersTable customers={customers}/>
    )
}