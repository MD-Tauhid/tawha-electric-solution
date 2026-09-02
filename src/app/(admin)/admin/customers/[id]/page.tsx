import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, MapPin, Phone, Mail, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getCustomer } from "../actions";
import { DeleteCustomerButton } from "./delete-button";

interface CustomerViewPageProps {
  params: Promise<{ id: string }>;
}

const customerTypeLabels: Record<string, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
  RESTAURANT: "Restaurant",
  OTHER: "Other",
};

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
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="secondary">
                    {customerTypeLabels[customer.type] || customer.type}
                  </Badge>
                </div>
              </div>
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm">{customer.email}</p>
                  </div>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm">{customer.phone}</p>
                  </div>
                </div>
              )}
              {(customer.address || customer.city || customer.state) && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-sm">
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
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {customer.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="text-sm font-medium">{customer._count.projects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Proposals</span>
                <span className="text-sm font-medium">{customer._count.proposals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {customer.projects.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
              <div className="space-y-3">
                {customer.projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.projectNumber}
                      </p>
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customer.proposals.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Proposals</h2>
              <div className="space-y-3">
                {customer.proposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {proposal.projectName || proposal.proposalNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {proposal.proposalNumber}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      ${Number(proposal.totalAmount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
