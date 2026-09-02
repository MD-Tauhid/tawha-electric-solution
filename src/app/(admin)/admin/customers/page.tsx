import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { getCustomers } from "./actions";
import { CustomerFilters } from "./customer-filters";
import { CustomerPagination } from "./customer-pagination";

interface CustomersPageProps {
  searchParams: Promise<{
    query?: string;
    type?: string;
    page?: string;
  }>;
}

const customerTypeLabels: Record<string, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
  RESTAURANT: "Restaurant",
  OTHER: "Other",
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const result = await getCustomers({
    query: params.query,
    type: params.type as "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "RESTAURANT" | "OTHER" | undefined,
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
  });

  return (
    <DashboardShell
      title="Customers"
      description="Manage your customer database"
      actions={
        <Link href="/admin/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <CustomerFilters />

      {/* Table */}
      {result.customers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No customers found"
          description={
            result.total === 0
              ? "Get started by adding your first customer."
              : "No customers match your search criteria."
          }
          action={
            result.total === 0 ? (
              <Link href="/admin/customers/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
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
                  <TableHead className="hidden sm:table-cell">Company</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Projects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="font-medium hover:underline"
                      >
                        {customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {customer.companyName || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {customer.email || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {customer.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {customerTypeLabels[customer.type] || customer.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {customer._count.projects}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/customers/${customer.id}`}>
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
          <CustomerPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </>
      )}
    </DashboardShell>
  );
}
