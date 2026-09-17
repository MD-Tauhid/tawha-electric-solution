import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { getBills } from "./actions";
import { BillFilters } from "./bill-filters";
import { BillPagination } from "./bill-pagination";

interface BillsPageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    projectId?: string;
    page?: string;
  }>;
}

export default async function BillsPage({ searchParams }: BillsPageProps) {
  const params = await searchParams;
  const result = await getBills({
    query: params.query,
    status: params.status as
      | "DRAFT"
      | "ISSUED"
      | "PARTIALLY_PAID"
      | "PAID"
      | "CANCELLED"
      | undefined,
    projectId: params.projectId,
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
  });

  return (
    <DashboardShell
      title="Bills"
      description="Manage your bills"
      actions={
        <Link href="/admin/bills/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Bill
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <BillFilters />

      {/* Table */}
      {result.bills.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-6 w-6" />}
          title="No bills found"
          description={
            result.total === 0
              ? "Get started by creating your first bill."
              : "No bills match your search criteria."
          }
          action={
            result.total === 0 ? (
              <Link href="/admin/bills/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Bill
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Bill Number</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Project
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Customer
                  </TableHead>
                  <TableHead>Payable</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>
                      <span className="font-mono text-sm text-muted-foreground">
                        {bill.billNumber}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Link
                        href={`/admin/projects/${bill.project.id}`}
                        className="font-medium text-card-foreground hover:text-primary transition-colors"
                      >
                        {bill.project.projectNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {bill.project.customer.companyName ||
                        bill.project.customer.name}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-card-foreground">
                        ${Number(bill.payableAmount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={bill.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/bills/${bill.id}`}>
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
          <BillPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </>
      )}
    </DashboardShell>
  );
}
