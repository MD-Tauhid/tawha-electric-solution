import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/admin/dashboard-shell";
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
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Service Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="text-2xl font-bold">
                  ${Number(service.rate).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">per {service.unit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit</p>
                <p className="text-sm">{service.unit}</p>
              </div>
            </div>
          </div>

          {service.description && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {service.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Featured</span>
                <Badge variant={service.isFeatured ? "default" : "secondary"}>
                  {service.isFeatured ? (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </span>
                  ) : (
                    "Not Featured"
                  )}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Usage</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Project Items</span>
                <span className="text-sm font-medium">
                  {service._count.projectItems}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Proposal Items</span>
                <span className="text-sm font-medium">
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
