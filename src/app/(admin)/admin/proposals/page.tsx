import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { getProposals } from "./actions";
import { ProposalFilters } from "./proposal-filters";
import { ProposalPagination } from "./proposal-pagination";

interface ProposalsPageProps {
  searchParams: Promise<{
    query?: string;
    customerId?: string;
    page?: string;
  }>;
}

export default async function ProposalsPage({ searchParams }: ProposalsPageProps) {
  const params = await searchParams;
  const result = await getProposals({
    query: params.query,
    customerId: params.customerId,
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
  });

  return (
    <DashboardShell
      title="Proposals"
      description="Manage your proposals"
      actions={
        <Link href="/admin/proposals/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Proposal
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <ProposalFilters />

      {/* Table */}
      {result.proposals.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No proposals found"
          description={
            result.total === 0
              ? "Get started by creating your first proposal."
              : "No proposals match your search criteria."
          }
          action={
            result.total === 0 ? (
              <Link href="/admin/proposals/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Proposal
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proposal Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Project</TableHead>
                  <TableHead className="hidden sm:table-cell">Recipient</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="hidden sm:table-cell">Items</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {proposal.proposalNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      {proposal.customer.companyName || proposal.customer.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {proposal.projectName || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {proposal.recipientName || "—"}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${Number(proposal.totalAmount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {proposal._count.items}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/proposals/${proposal.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <ProposalPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </>
      )}
    </DashboardShell>
  );
}
