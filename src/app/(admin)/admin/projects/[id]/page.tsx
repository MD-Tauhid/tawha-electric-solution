import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, MapPin, Calendar } from "lucide-react";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { getProject } from "../actions";
import { DeleteProjectButton } from "./delete-button";
import { StatusUpdateButton } from "./status-update-button";

interface ProjectViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectViewPage({ params }: ProjectViewPageProps) {
  const { id } = await params;

  let project;
  try {
    project = await getProject(id);
  } catch {
    notFound();
  }

  const totalItemsValue = project.items.reduce(
    (sum, item) => sum + Number(item.totalAmount),
    0
  );

  return (
    <DashboardShell
      title={project.name}
      description={`Project ${project.projectNumber}`}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/admin/projects/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteProjectButton projectId={id} />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Project Details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={project.status} />
                  <StatusUpdateButton
                    projectId={id}
                    currentStatus={project.status as "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED"}
                  />
                </div>
              </div>
              {project.location && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                    <p className="mt-1 text-sm text-card-foreground">{project.location}</p>
                  </div>
                </div>
              )}
              {project.startDate && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Date</p>
                    <p className="mt-1 text-sm text-card-foreground">
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {project.expectedEndDate && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Expected End</p>
                    <p className="mt-1 text-sm text-card-foreground">
                      {new Date(project.expectedEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {project.actualEndDate && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Actual End</p>
                    <p className="mt-1 text-sm text-card-foreground">
                      {new Date(project.actualEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-2">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>
          )}

          {/* Project Items */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Project Items</h2>
            {project.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items added yet.</p>
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
                  {project.items.map((item) => (
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

          {/* Notes */}
          {project.notes && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {project.notes}
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
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="text-xl font-bold text-card-foreground">
                  ${Number(project.totalValue).toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Items Total</span>
                <span className="text-sm font-medium text-card-foreground">
                  ${totalItemsValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Items Count</span>
                <span className="text-sm font-medium text-card-foreground">{project._count.items}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Customer</h2>
            <div className="space-y-1.5">
              <Link
                href={`/admin/customers/${project.customer.id}`}
                className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
              >
                {project.customer.name}
              </Link>
              {project.customer.companyName && (
                <p className="text-sm text-muted-foreground">
                  {project.customer.companyName}
                </p>
              )}
              {project.customer.email && (
                <p className="text-sm text-muted-foreground">
                  {project.customer.email}
                </p>
              )}
              {project.customer.phone && (
                <p className="text-sm text-muted-foreground">
                  {project.customer.phone}
                </p>
              )}
            </div>
          </div>

          {/* Bills */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Bills</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Bills</span>
                <span className="text-sm font-semibold text-card-foreground">{project._count.bills}</span>
              </div>
              {project.bills.length > 0 && (
                <div className="space-y-2">
                  {project.bills.map((bill) => (
                    <Link
                      key={bill.id}
                      href={`/admin/bills/${bill.id}`}
                      className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{bill.billNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={bill.status} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium text-card-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Updated</span>
                <span className="text-sm font-medium text-card-foreground">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
