"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { paymentSchema, type PaymentFormData } from "@/lib/validations/payment";
import { createPayment, getBillPaymentSummary, type BillForPaymentSelect } from "../actions";

interface BillSummary {
  billId: string;
  billNumber: string;
  payableAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: string;
}

interface NewPaymentFormProps {
  bills: BillForPaymentSelect[];
}

const paymentMethodOptions = [
  { value: "", label: "Select payment method" },
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "MOBILE_BANKING", label: "Mobile Banking" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" },
];

export function NewPaymentForm({ bills }: NewPaymentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [billSummary, setBillSummary] = React.useState<BillSummary | null>(
    null
  );
  const [loadingSummary, setLoadingSummary] = React.useState(false);

  const billOptions = [
    { value: "", label: "Select a bill" },
    ...bills.map((b) => ({
      value: b.id,
      label: b.label,
    })),
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema) as never,
    defaultValues: {
      billId: "",
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      method: "CASH",
      reference: "",
      notes: "",
    },
  });

  const watchAmount = watch("amount");
  const watchBillId = watch("billId");

  // Fetch bill summary when bill is selected
  React.useEffect(() => {
    if (watchBillId) {
      setLoadingSummary(true);
      getBillPaymentSummary(watchBillId)
        .then((summary) => {
          setBillSummary(summary);
          // Set the max amount to outstanding balance
          if (summary.outstandingAmount > 0) {
            setValue("amount", summary.outstandingAmount);
          }
        })
        .catch(() => {
          setBillSummary(null);
        })
        .finally(() => {
          setLoadingSummary(false);
        });
    } else {
      setBillSummary(null);
    }
  }, [watchBillId, setValue]);

  async function handleFormSubmit(data: PaymentFormData) {
    setIsSubmitting(true);
    try {
      await createPayment(data);
      toast.success("Payment recorded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Bill Selection */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Bill Selection</h2>
        <div className="space-y-2">
          <Label htmlFor="billId">
            Select Bill <span className="text-destructive">*</span>
          </Label>
          <Select
            id="billId"
            options={billOptions}
            {...register("billId")}
            aria-invalid={!!errors.billId}
          />
          {errors.billId && (
            <p className="text-sm text-destructive">{errors.billId.message}</p>
          )}
        </div>

        {/* Bill Summary */}
        {loadingSummary && (
          <div className="mt-4 rounded-md bg-muted p-4 flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-muted-foreground">
              Loading bill details...
            </span>
          </div>
        )}

        {billSummary && !loadingSummary && (
          <div className="mt-4 rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium mb-3">Bill Summary</h3>
            <div className="grid gap-2 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Bill Number
                </p>
                <p className="text-sm font-medium font-mono">
                  {billSummary.billNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Payable Amount
                </p>
                <p className="text-sm font-medium">
                  ${billSummary.payableAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Already Paid
                </p>
                <p className="text-sm font-medium text-green-600">
                  ${billSummary.paidAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Outstanding
                </p>
                <p className="text-lg font-bold text-primary">
                  ${billSummary.outstandingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount ($) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={billSummary?.outstandingAmount}
              placeholder="e.g. 150000"
              {...register("amount", { valueAsNumber: true })}
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
            {billSummary && watchAmount > billSummary.outstandingAmount && (
              <p className="text-sm text-destructive">
                Amount cannot exceed outstanding balance ($
                {billSummary.outstandingAmount.toLocaleString()})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">
              Payment Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="paymentDate"
              type="date"
              {...register("paymentDate")}
              aria-invalid={!!errors.paymentDate}
            />
            {errors.paymentDate && (
              <p className="text-sm text-destructive">
                {errors.paymentDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">
              Payment Method <span className="text-destructive">*</span>
            </Label>
            <Select
              id="method"
              options={paymentMethodOptions}
              {...register("method")}
              aria-invalid={!!errors.method}
            />
            {errors.method && (
              <p className="text-sm text-destructive">{errors.method.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              placeholder="e.g. Transaction ID, Cheque number"
              {...register("reference")}
              aria-invalid={!!errors.reference}
            />
            {errors.reference && (
              <p className="text-sm text-destructive">
                {errors.reference.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Notes</h2>
        <Textarea
          id="notes"
          placeholder="Additional notes about this payment..."
          rows={4}
          {...register("notes")}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          Record Payment
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
