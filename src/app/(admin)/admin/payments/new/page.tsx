import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getBillsForPaymentSelect } from "../actions";
import { NewPaymentForm } from "./new-payment-form";

export default async function NewPaymentPage() {
  const bills = await getBillsForPaymentSelect();

  return (
    <DashboardShell
      title="Record Payment"
      description="Record a payment against a bill"
    >
      <NewPaymentForm bills={bills} />
    </DashboardShell>
  );
}
