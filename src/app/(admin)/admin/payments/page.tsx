import Link from "next/link";
import { Plus, CreditCard } from "lucide-react";
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
import { getPayments } from "./actions";
import { PaymentFilters } from "./payment-filters";
import { PaymentPagination } from "./payment-pagination";

interface PaymentsPageProps {
  searchParams: Promise<{
    query?: string;
    method?: string;
    billId?: string;
    projectId?: string;
    page?: string;
  }>;
}

const paymentMethodLabels: Record<string, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  MOBILE_BANKING: "Mobile Banking",
  CHEQUE: "Cheque",
  OTHER: "Other",
};

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const params = await searchParams;
  const result = await getPayments({
    query: params.query,
    method: params.method as
      | "CASH"
      | "BANK_TRANSFER"
      | "MOBILE_BANKING"
      | "CHEQUE"
      | "OTHER"
      | undefined,
    billId: params.billId,
    projectId: params.projectId,
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
  });

  return (
    <DashboardShell
      title="Payments"
      description="Track and manage all payments"
      actions={
        <Link href="/admin/payments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <PaymentFilters />

      {/* Table */}
      {result.payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-6 w-6" />}
          title="No payments found"
          description={
            result.total === 0
              ? "Get started by recording your first payment."
              : "No payments match your search criteria."
          }
          action={
            result.total === 0 ? (
              <Link href="/admin/payments/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Payment
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
                  <TableHead>Date</TableHead>
                  <TableHead>Bill</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Project
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Customer
                  </TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Reference
                  </TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/bills/${payment.bill.id}`}
                        className="font-mono text-sm hover:underline"
                      >
                        {payment.bill.billNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Link
                        href={`/admin/projects/${payment.bill.project.id}`}
                        className="font-medium hover:underline"
                      >
                        {payment.bill.project.projectNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {payment.bill.project.customer.companyName ||
                        payment.bill.project.customer.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {paymentMethodLabels[payment.method] || payment.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {payment.reference || "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${Number(payment.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/payments/${payment.id}`}>
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
          <PaymentPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </>
      )}
    </DashboardShell>
  );
}
