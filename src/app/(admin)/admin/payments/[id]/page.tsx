import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getPayment } from "../actions";
import { DeletePaymentButton } from "./delete-button";

interface PaymentViewPageProps {
  params: Promise<{ id: string }>;
}

const paymentMethodLabels: Record<string, string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  MOBILE_BANKING: "Mobile Banking",
  CHEQUE: "Cheque",
  OTHER: "Other",
};

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

export default async function PaymentViewPage({ params }: PaymentViewPageProps) {
  const { id } = await params;

  let payment;
  try {
    payment = await getPayment(id);
  } catch {
    notFound();
  }

  return (
    <DashboardShell
      title="Payment Details"
      description={`Payment for bill ${payment.bill.billNumber}`}
      actions={
        <DeletePaymentButton paymentId={id} billId={payment.billId} />
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Details */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ${Number(payment.amount).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p className="text-sm">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <div className="mt-1">
                  <Badge variant="outline">
                    {paymentMethodLabels[payment.method] || payment.method}
                  </Badge>
                </div>
              </div>
              {payment.reference && (
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="text-sm font-medium">{payment.reference}</p>
                </div>
              )}
            </div>

            {payment.notes && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-sm whitespace-pre-wrap">{payment.notes}</p>
              </div>
            )}
          </div>

          {/* Bill Info */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Bill Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Bill Number</p>
                <Link
                  href={`/admin/bills/${payment.bill.id}`}
                  className="text-sm font-medium font-mono hover:underline"
                >
                  {payment.bill.billNumber}
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bill Status</p>
                <div className="mt-1">
                  <Badge
                    variant={
                      billStatusVariants[payment.bill.status] || "secondary"
                    }
                  >
                    {billStatusLabels[payment.bill.status] || payment.bill.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payable Amount</p>
                <p className="text-sm font-medium">
                  ${Number(payment.bill.payableAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(payment.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Project</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/projects/${payment.bill.project.id}`}
                className="text-sm font-medium hover:underline"
              >
                {payment.bill.project.name}
              </Link>
              <p className="text-xs text-muted-foreground font-mono">
                {payment.bill.project.projectNumber}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/customers/${payment.bill.project.customer.id}`}
                className="text-sm font-medium hover:underline"
              >
                {payment.bill.project.customer.name}
              </Link>
              {payment.bill.project.customer.companyName && (
                <p className="text-sm text-muted-foreground">
                  {payment.bill.project.customer.companyName}
                </p>
              )}
              {payment.bill.project.customer.email && (
                <p className="text-sm text-muted-foreground">
                  {payment.bill.project.customer.email}
                </p>
              )}
              {payment.bill.project.customer.phone && (
                <p className="text-sm text-muted-foreground">
                  {payment.bill.project.customer.phone}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/bills/${payment.billId}`}
                className="block text-sm text-primary hover:underline"
              >
                <CreditCard className="mr-2 h-4 w-4 inline" />
                View Bill
              </Link>
              <Link
                href={`/admin/projects/${payment.bill.project.id}`}
                className="block text-sm text-primary hover:underline"
              >
                View Project
              </Link>
              <Link
                href={`/admin/customers/${payment.bill.project.customer.id}`}
                className="block text-sm text-primary hover:underline"
              >
                View Customer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
