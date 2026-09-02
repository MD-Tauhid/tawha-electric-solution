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
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
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

const billStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  ISSUED: "Issued",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

const billStatusVariants: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  DRAFT: "secondary",
  ISSUED: "default",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  CANCELLED: "destructive",
};

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
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
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
                      <span className="font-mono text-sm">
                        {bill.billNumber}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Link
                        href={`/admin/projects/${bill.project.id}`}
                        className="font-medium hover:underline"
                      >
                        {bill.project.projectNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {bill.project.customer.companyName ||
                        bill.project.customer.name}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${Number(bill.payableAmount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          billStatusVariants[bill.status] || "secondary"
                        }
                      >
                        {billStatusLabels[bill.status] || bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
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
