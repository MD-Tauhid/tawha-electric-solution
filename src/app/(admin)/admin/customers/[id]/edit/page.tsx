import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { CustomerForm } from "@/components/admin/customer-form";
import { getCustomer, updateCustomer } from "../../actions";

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;

  let customer;
  try {
    customer = await getCustomer(id);
  } catch {
    notFound();
  }

  async function handleUpdate(data: Parameters<typeof updateCustomer>[1]) {
    "use server";
    await updateCustomer(id, data);
  }

  return (
    <DashboardShell
      title="Edit Customer"
      description={`Editing ${customer.name}`}
    >
      <div className="max-w-2xl">
        <CustomerForm customer={customer} onSubmit={handleUpdate} />
      </div>
    </DashboardShell>
  );
}
