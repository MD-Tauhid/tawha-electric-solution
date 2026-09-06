import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, MapPin, Phone, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { getCustomer } from "../actions";
import { DeleteCustomerButton } from "./delete-button";

interface CustomerViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerViewPage({ params }: CustomerViewPageProps) {
  const { id } = await params;

  let customer;
  try {
    customer = await getCustomer(id);
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title={customer.name}
      description={customer.companyName || "Customer details"}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/admin/customers/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteCustomerButton customerId={id} />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Contact Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</p>
                  <div className="mt-1">
                    <StatusBadge status={customer.type} />
                  </div>
                </div>
              </div>
              {customer.email && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="mt-1 text-sm text-card-foreground">{customer.email}</p>
                  </div>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                    <p className="mt-1 text-sm text-card-foreground">{customer.phone}</p>
                  </div>
                </div>
              )}
              {(customer.address || customer.city || customer.state) && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
                    <p className="mt-1 text-sm text-card-foreground">
                      {[customer.address, customer.city, customer.state, customer.zipCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {customer.notes && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {customer.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="text-sm font-semibold text-card-foreground">{customer._count.projects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Proposals</span>
                <span className="text-sm font-semibold text-card-foreground">{customer._count.proposals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium text-card-foreground">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {customer.projects.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-4">Recent Projects</h2>
              <div className="space-y-3">
                {customer.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {project.projectNumber}
                      </p>
                    </div>
                    <StatusBadge status={project.status} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {customer.proposals.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-4">Recent Proposals</h2>
              <div className="space-y-3">
                {customer.proposals.map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/admin/proposals/${proposal.id}`}
                    className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {proposal.projectName || proposal.proposalNumber}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {proposal.proposalNumber}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">
                      ${Number(proposal.totalAmount).toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
