import Link from "next/link";
import { Plus, Wrench } from "lucide-react";
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
import { getServices } from "./actions";
import { ServiceFilters } from "./service-filters";
import { ServicePagination } from "./service-pagination";
import { ToggleActiveButton } from "./toggle-active-button";
import { ToggleFeaturedButton } from "./toggle-featured-button";

interface ServicesPageProps {
  searchParams: Promise<{
    query?: string;
    isActive?: string;
    isFeatured?: string;
    page?: string;
  }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const result = await getServices({
    query: params.query,
    isActive: params.isActive as "true" | "false" | undefined,
    isFeatured: params.isFeatured as "true" | "false" | undefined,
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
  });

  return (
    <DashboardShell
      title="Services"
      description="Manage your service catalog"
      actions={
        <Link href="/admin/services/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <ServiceFilters />

      {/* Table */}
      {result.services.length === 0 ? (
        <EmptyState
          icon={<Wrench className="h-6 w-6" />}
          title="No services found"
          description={
            result.total === 0
              ? "Get started by adding your first service."
              : "No services match your search criteria."
          }
          action={
            result.total === 0 ? (
              <Link href="/admin/services/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
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
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="hidden sm:table-cell">Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="font-medium hover:underline"
                      >
                        {service.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell max-w-[200px] truncate">
                      {service.description || "—"}
                    </TableCell>
                    <TableCell>
                      ${Number(service.rate).toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {service.unit}
                    </TableCell>
                    <TableCell>
                      <ToggleActiveButton
                        serviceId={service.id}
                        isActive={service.isActive}
                      />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <ToggleFeaturedButton
                        serviceId={service.id}
                        isFeatured={service.isFeatured}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/services/${service.id}`}>
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
          <ServicePagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </>
      )}
    </DashboardShell>
  );
}
