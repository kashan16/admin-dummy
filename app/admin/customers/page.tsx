import Customers from "@/components/customers/Customers";
import { mockCustomers } from "@/lib/mockCustomers";

export default function CustomersPage() {
    return <Customers initialCustomers={mockCustomers} />
}