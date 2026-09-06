import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Calendar, CreditCard } from "lucide-react";
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
import { getBill } from "../actions";
import { DeleteBillButton } from "./delete-button";
import { StatusUpdateButton } from "./status-update-button";

interface BillViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function BillViewPage({ params }: BillViewPageProps) {
  const { id } = await params;

  let bill;
  try {
    bill = await getBill(id);
  } catch {
    notFound();
  }

  const totalPaid = bill.payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
  const outstandingAmount = Number(bill.payableAmount) - totalPaid;

  return (
    <DashboardShell
      title={`Bill ${bill.billNumber}`}
      description={`For project ${bill.project.projectNumber}`}
      actions={
        <div className="flex items-center gap-2">
          {outstandingAmount > 0 && bill.status !== "CANCELLED" && (
            <Link href={`/admin/payments/new?billId=${id}`}>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </Link>
          )}
          <a
            href={`/api/bills/${id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </a>
          <DeleteBillButton billId={id} />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bill Details */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Bill Details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={bill.status} />
                  <StatusUpdateButton
                    billId={id}
                    currentStatus={
                      bill.status as
                        | "DRAFT"
                        | "ISSUED"
                        | "PARTIALLY_PAID"
                        | "PAID"
                        | "CANCELLED"
                    }
                  />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</p>
                  <p className="mt-1 text-sm text-card-foreground">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Calculation */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Calculation</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Area</span>
                  <span className="text-sm font-medium text-card-foreground">
                    {Number(bill.area).toLocaleString()} sq ft
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rate</span>
                  <span className="text-sm font-medium text-card-foreground">
                    ${Number(bill.rate).toLocaleString()} / sq ft
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-sm font-medium text-card-foreground">
                    ${Number(bill.totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Percentage to Pay</span>
                  <span className="text-sm font-medium text-card-foreground">
                    {Number(bill.percentage).toLocaleString()}%
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-card-foreground">Payable Amount</span>
                  <span className="text-xl font-bold text-card-foreground">
                    ${Number(bill.payableAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Items */}
          {bill.project.items.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-4">Project Items</h2>
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
                  {bill.project.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-card-foreground">{item.service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Rate snapshot: $
                            {Number(item.rate).toLocaleString()}/
                            {item.service.unit}
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
            </div>
          )}

          {/* Notes */}
          {bill.notes && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="text-base font-semibold text-card-foreground mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {bill.notes}
              </p>
            </div>
          )}

          {/* Payment History */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Payment History</h2>
            {bill.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No payments recorded yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Reference
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Link
                          href={`/admin/payments/${payment.id}`}
                          className="text-card-foreground hover:text-primary transition-colors"
                        >
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.method} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {payment.reference || "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium text-card-foreground">
                        ${Number(payment.amount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payable Amount</span>
                <span className="text-sm font-medium text-card-foreground">
                  ${Number(bill.payableAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Paid</span>
                <span className="text-sm font-medium text-emerald-600">
                  ${totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-card-foreground">Outstanding</span>
                <span
                  className={`text-xl font-bold ${
                    outstandingAmount > 0
                      ? "text-destructive"
                      : "text-emerald-600"
                  }`}
                >
                  ${outstandingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Project</h2>
            <div className="space-y-1.5">
              <Link
                href={`/admin/projects/${bill.project.id}`}
                className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
              >
                {bill.project.name}
              </Link>
              <p className="text-xs text-muted-foreground font-mono">
                {bill.project.projectNumber}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Customer</h2>
            <div className="space-y-1.5">
              <Link
                href={`/admin/customers/${bill.project.customer.id}`}
                className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
              >
                {bill.project.customer.name}
              </Link>
              {bill.project.customer.companyName && (
                <p className="text-sm text-muted-foreground">
                  {bill.project.customer.companyName}
                </p>
              )}
              {bill.project.customer.email && (
                <p className="text-sm text-muted-foreground">
                  {bill.project.customer.email}
                </p>
              )}
              {bill.project.customer.phone && (
                <p className="text-sm text-muted-foreground">
                  {bill.project.customer.phone}
                </p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Updated</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {new Date(bill.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
