import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Download, MapPin, Calendar } from "lucide-react";
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
import { getProposal } from "../actions";
import { DeleteProposalButton } from "./delete-button";

interface ProposalViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalViewPage({ params }: ProposalViewPageProps) {
  const { id } = await params;

  let proposal;
  try {
    proposal = await getProposal(id);
  } catch {
    notFound();
  }

  const itemsTotal = proposal.items.reduce(
    (sum, item) => sum + Number(item.totalAmount),
    0
  );

  return (
    <DashboardShell
      title={`Proposal ${proposal.proposalNumber}`}
      description={proposal.projectName || "Proposal details"}
      actions={
        <div className="flex items-center gap-2">
          <a
            href={`/api/proposals/${id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </a>
          <Link href={`/admin/proposals/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteProposalButton proposalId={id} />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipient Information */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Recipient Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer</p>
                <Link
                  href={`/admin/customers/${proposal.customer.id}`}
                  className="text-sm font-medium text-card-foreground hover:text-primary transition-colors mt-1 block"
                >
                  {proposal.customer.name}
                </Link>
                {proposal.customer.companyName && (
                  <p className="text-sm text-muted-foreground">
                    {proposal.customer.companyName}
                  </p>
                )}
              </div>
              {proposal.recipientName && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recipient</p>
                  <p className="text-sm font-medium text-card-foreground mt-1">{proposal.recipientName}</p>
                </div>
              )}
              {proposal.recipientAddress && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
                    <p className="text-sm text-card-foreground mt-1">{proposal.recipientAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Information */}
          {(proposal.projectName || proposal.projectAddress) && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-4">Project Information</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {proposal.projectName && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project Name</p>
                    <p className="text-sm font-medium text-card-foreground mt-1">{proposal.projectName}</p>
                  </div>
                )}
                {proposal.projectAddress && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
                      <p className="text-sm text-card-foreground mt-1">{proposal.projectAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services/Items */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Services</h2>
            {proposal.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No services added.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposal.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-card-foreground">{item.service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Rate snapshot: ${Number(item.rate).toLocaleString()}/{item.service.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-card-foreground">
                        {Number(item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-card-foreground">
                        ${Number(item.rate).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-card-foreground">
                        ${Number(item.totalAmount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Terms */}
          {proposal.terms && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-2">Terms & Conditions</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {proposal.terms}
              </p>
            </div>
          )}

          {/* Notes */}
          {proposal.notes && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {proposal.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Services Total</span>
                <span className="text-sm font-medium text-card-foreground">
                  ${itemsTotal.toLocaleString()}
                </span>
              </div>
              {Number(proposal.additionalCharges) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Additional Charges</span>
                  <span className="text-sm font-medium text-card-foreground">
                    +${Number(proposal.additionalCharges).toLocaleString()}
                  </span>
                </div>
              )}
              {Number(proposal.discount) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Discount</span>
                  <span className="text-sm font-medium text-destructive">
                    -${Number(proposal.discount).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-card-foreground">Total Amount</span>
                <span className="text-xl font-bold text-card-foreground">
                  ${Number(proposal.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Customer</h2>
            <div className="space-y-1.5">
              <Link
                href={`/admin/customers/${proposal.customer.id}`}
                className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
              >
                {proposal.customer.name}
              </Link>
              {proposal.customer.companyName && (
                <p className="text-sm text-muted-foreground">
                  {proposal.customer.companyName}
                </p>
              )}
              {proposal.customer.email && (
                <p className="text-sm text-muted-foreground">
                  {proposal.customer.email}
                </p>
              )}
              {proposal.customer.phone && (
                <p className="text-sm text-muted-foreground">
                  {proposal.customer.phone}
                </p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Updated</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {new Date(proposal.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
