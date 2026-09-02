import { DashboardShell } from "@/components/admin/dashboard-shell";
import { ProposalForm } from "@/components/admin/proposal-form";
import { createProposal, getActiveServices, getActiveCustomers } from "../actions";

export default async function NewProposalPage() {
  const [services, customers] = await Promise.all([
    getActiveServices(),
    getActiveCustomers(),
  ]);

  return (
    <DashboardShell
      title="Create Proposal"
      description="Create a new proposal for a customer"
    >
      <ProposalForm
        customers={customers}
        services={services}
        onSubmit={createProposal}
      />
    </DashboardShell>
  );
}
