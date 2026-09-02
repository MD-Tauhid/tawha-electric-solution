import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { ProposalForm } from "@/components/admin/proposal-form";
import {
  getProposal,
  updateProposal,
  getActiveServices,
  getActiveCustomers,
} from "../../actions";

interface EditProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProposalPage({ params }: EditProposalPageProps) {
  const { id } = await params;

  let proposal;
  try {
    proposal = await getProposal(id);
  } catch {
    notFound();
  }

  const [services, customers] = await Promise.all([
    getActiveServices(),
    getActiveCustomers(),
  ]);

  async function handleUpdate(data: Parameters<typeof updateProposal>[1]) {
    "use server";
    await updateProposal(id, data);
  }

  return (
    <DashboardShell
      title="Edit Proposal"
      description={`Editing ${proposal.proposalNumber}`}
    >
      <ProposalForm
        proposal={proposal}
        customers={customers}
        services={services}
        onSubmit={handleUpdate}
      />
    </DashboardShell>
  );
}
