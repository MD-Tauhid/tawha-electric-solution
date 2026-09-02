import { DashboardShell } from "@/components/admin/dashboard-shell";
import { CustomerForm } from "@/components/admin/customer-form";
import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  return (
    <DashboardShell
      title="Create Customer"
      description="Add a new customer to your database"
    >
      <div className="max-w-2xl">
        <CustomerForm onSubmit={createCustomer} />
      </div>
    </DashboardShell>
  );
}
