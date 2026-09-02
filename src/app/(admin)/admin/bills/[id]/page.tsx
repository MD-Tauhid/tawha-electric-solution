import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getBill } from "../actions";
import { DeleteBillButton } from "./delete-button";
import { StatusUpdateButton } from "./status-update-button";

interface BillViewPageProps {
  params: Promise<{ id: string }>;
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
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant={
                      billStatusVariants[bill.status] || "secondary"
                    }
                  >
                    {billStatusLabels[bill.status] || bill.status}
                  </Badge>
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
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Calculation */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Calculation</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Area</span>
                  <span className="text-sm font-medium">
                    {Number(bill.area).toLocaleString()} sq ft
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rate</span>
                  <span className="text-sm font-medium">
                    ${Number(bill.rate).toLocaleString()} / sq ft
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Amount
                  </span>
                  <span className="text-sm font-medium">
                    ${Number(bill.totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Percentage to Pay
                  </span>
                  <span className="text-sm font-medium">
                    {Number(bill.percentage).toLocaleString()}%
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-semibold">
                    Payable Amount
                  </span>
                  <span className="text-lg font-bold">
                    ${Number(bill.payableAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Items */}
          {bill.project.items.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-4">
                Project Items
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
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
                          <p className="font-medium">{item.service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Rate snapshot: $
                            {Number(item.rate).toLocaleString()}/
                            {item.service.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${Number(item.rate).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
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
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {bill.notes}
              </p>
            </div>
          )}

          {/* Payment History */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Payment History</h2>
            {bill.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payments recorded yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
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
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.method.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {payment.reference || "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
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
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Payable Amount
                </span>
                <span className="text-sm font-medium">
                  ${Number(bill.payableAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Paid
                </span>
                <span className="text-sm font-medium text-green-600">
                  ${totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-sm font-semibold">
                  Outstanding
                </span>
                <span
                  className={`text-lg font-bold ${
                    outstandingAmount > 0
                      ? "text-destructive"
                      : "text-green-600"
                  }`}
                >
                  ${outstandingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Project</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/projects/${bill.project.id}`}
                className="text-sm font-medium hover:underline"
              >
                {bill.project.name}
              </Link>
              <p className="text-xs text-muted-foreground font-mono">
                {bill.project.projectNumber}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/customers/${bill.project.customer.id}`}
                className="text-sm font-medium hover:underline"
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
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p className="text-sm font-medium">
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
