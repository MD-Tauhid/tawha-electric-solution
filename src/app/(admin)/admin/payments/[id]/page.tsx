import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, CreditCard } from "lucide-react";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { getPayment } from "../actions";
import { DeletePaymentButton } from "./delete-button";

interface PaymentViewPageProps {
  params: Promise<{ id: string }>;
}

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
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Payment Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  ${Number(payment.amount).toLocaleString()}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Date</p>
                  <p className="text-sm text-card-foreground mt-1">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Method</p>
                <div className="mt-1.5">
                  <StatusBadge status={payment.method} />
                </div>
              </div>
              {payment.reference && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reference</p>
                  <p className="text-sm font-medium text-card-foreground mt-1">{payment.reference}</p>
                </div>
              )}
            </div>

            {payment.notes && (
              <div className="mt-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{payment.notes}</p>
              </div>
            )}
          </div>

          {/* Bill Info */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Bill Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bill Number</p>
                <Link
                  href={`/admin/bills/${payment.bill.id}`}
                  className="text-sm font-medium font-mono text-card-foreground hover:text-primary transition-colors mt-1 block"
                >
                  {payment.bill.billNumber}
                </Link>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bill Status</p>
                <div className="mt-1.5">
                  <StatusBadge status={payment.bill.status} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payable Amount</p>
                <p className="text-sm font-medium text-card-foreground mt-1">
                  ${Number(payment.bill.payableAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Timestamps</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
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
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Project</h2>
            <div className="space-y-1.5">
              <Link
                href={`/admin/projects/${payment.bill.project.id}`}
                className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
              >
                {payment.bill.project.name}
              </Link>
              <p className="text-xs text-muted-foreground font-mono">
                {payment.bill.project.projectNumber}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Customer</h2>
            <div className="space-y-1.5">
              <Link
                href={`/admin/customers/${payment.bill.project.customer.id}`}
                className="text-sm font-medium text-card-foreground hover:text-primary transition-colors"
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
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/bills/${payment.billId}`}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                View Bill
              </Link>
              <Link
                href={`/admin/projects/${payment.bill.project.id}`}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View Project
              </Link>
              <Link
                href={`/admin/customers/${payment.bill.project.customer.id}`}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
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
