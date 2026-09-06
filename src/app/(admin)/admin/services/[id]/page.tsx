import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { getService } from "../actions";
import { DeleteServiceButton } from "./delete-button";

interface ServiceViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceViewPage({ params }: ServiceViewPageProps) {
  const { id } = await params;

  let service;
  try {
    service = await getService(id);
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title={service.name}
      description={service.description || "Service details"}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/admin/services/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteServiceButton serviceId={id} />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Service Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rate</p>
                <p className="text-2xl font-bold text-card-foreground mt-1">
                  ${Number(service.rate).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per {service.unit}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit</p>
                <p className="text-sm text-card-foreground mt-1">{service.unit}</p>
              </div>
            </div>
          </div>

          {service.description && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-2">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {service.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <StatusBadge status={service.isActive ? "ONGOING" : "CANCELLED"} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                <StatusBadge status={service.isFeatured ? "ONGOING" : "DRAFT"} />
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium text-card-foreground">
                  {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Usage</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Project Items</span>
                <span className="text-sm font-semibold text-card-foreground">
                  {service._count.projectItems}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Proposal Items</span>
                <span className="text-sm font-semibold text-card-foreground">
                  {service._count.proposalItems}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
