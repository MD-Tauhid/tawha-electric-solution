"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  proposalSchema,
  type ProposalFormData,
} from "@/lib/validations/proposal";

interface Service {
  id: string;
  name: string;
  rate: unknown;
  unit: string;
}

interface Customer {
  id: string;
  name: string;
  companyName: string | null;
}

interface ProposalFormProps {
  proposal?: {
    id: string;
    recipientName: string | null;
    recipientAddress: string | null;
    customerId: string;
    projectName: string | null;
    projectAddress: string | null;
    additionalCharges: unknown;
    discount: unknown;
    terms: string | null;
    notes: string | null;
    items: Array<{
      id: string;
      serviceId: string;
      quantity: unknown;
      rate: unknown;
      totalAmount: unknown;
    }>;
  };
  customers: Customer[];
  services: Service[];
  onSubmit: (data: ProposalFormData) => Promise<void>;
}

export function ProposalForm({
  proposal,
  customers,
  services,
  onSubmit,
}: ProposalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const customerOptions = [
    { value: "", label: "Select a customer" },
    ...customers.map((c) => ({
      value: c.id,
      label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
    })),
  ];

  const serviceOptions = [
    { value: "", label: "Select a service" },
    ...services.map((s) => ({
      value: s.id,
      label: `${s.name} - $${Number(s.rate).toLocaleString()}/${s.unit}`,
    })),
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema) as never,
    defaultValues: {
      recipientName: proposal?.recipientName ?? "",
      recipientAddress: proposal?.recipientAddress ?? "",
      customerId: proposal?.customerId ?? "",
      projectName: proposal?.projectName ?? "",
      projectAddress: proposal?.projectAddress ?? "",
      additionalCharges: proposal?.additionalCharges
        ? Number(proposal.additionalCharges)
        : 0,
      discount: proposal?.discount ? Number(proposal.discount) : 0,
      terms: proposal?.terms ?? "",
      notes: proposal?.notes ?? "",
      items: proposal?.items.map((item) => ({
        id: item.id,
        serviceId: item.serviceId,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        totalAmount: Number(item.totalAmount),
      })) ?? [{ serviceId: "", quantity: 1, rate: 0, totalAmount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");
  const watchAdditionalCharges = watch("additionalCharges");
  const watchDiscount = watch("discount");

  // Calculate totals
  const itemsTotal = watchItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0
  );
  const totalAmount =
    itemsTotal + (watchAdditionalCharges || 0) - (watchDiscount || 0);

  function handleServiceChange(index: number, serviceId: string) {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setValue(`items.${index}.rate`, Number(service.rate));
      const quantity = watchItems[index]?.quantity || 1;
      setValue(`items.${index}.totalAmount`, quantity * Number(service.rate));
    }
  }

  function handleQuantityChange(index: number, quantity: number) {
    const rate = watchItems[index]?.rate || 0;
    setValue(`items.${index}.totalAmount`, quantity * rate);
  }

  function handleRateChange(index: number, rate: number) {
    const quantity = watchItems[index]?.quantity || 0;
    setValue(`items.${index}.totalAmount`, quantity * rate);
  }

  function addItem() {
    append({ serviceId: "", quantity: 1, rate: 0, totalAmount: 0 });
  }

  async function handleFormSubmit(data: ProposalFormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        proposal ? "Proposal updated successfully" : "Proposal created successfully"
      );
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
      {/* Recipient Information */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Recipient Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Customer */}
          <div className="space-y-2">
            <Label htmlFor="customerId">
              Customer <span className="text-destructive">*</span>
            </Label>
            <Select
              id="customerId"
              options={customerOptions}
              {...register("customerId")}
              aria-invalid={!!errors.customerId}
            />
            {errors.customerId && (
              <p className="text-sm text-destructive">
                {errors.customerId.message}
              </p>
            )}
          </div>

          {/* Recipient Name */}
          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              placeholder="John Doe"
              {...register("recipientName")}
            />
          </div>

          {/* Recipient Address */}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="recipientAddress">Recipient Address</Label>
            <Input
              id="recipientAddress"
              placeholder="123 Main St, City, State"
              {...register("recipientAddress")}
            />
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Project Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="Office Building Wiring"
              {...register("projectName")}
            />
          </div>

          {/* Project Address */}
          <div className="space-y-2">
            <Label htmlFor="projectAddress">Project Address</Label>
            <Input
              id="projectAddress"
              placeholder="456 Business Ave, City, State"
              {...register("projectAddress")}
            />
          </div>
        </div>
      </div>

      {/* Proposal Items */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Services</h2>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>

        {errors.items && (
          <p className="text-sm text-destructive mb-4">
            {errors.items.message}
          </p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-4 sm:grid-cols-[1fr_100px_100px_120px_40px] items-end"
            >
              {/* Service */}
              <div className="space-y-2">
                {index === 0 && <Label>Service</Label>}
                <Select
                  options={serviceOptions}
                  {...register(`items.${index}.serviceId`)}
                  onChange={(e) => {
                    register(`items.${index}.serviceId`).onChange(e);
                    handleServiceChange(index, e.target.value);
                  }}
                  aria-invalid={!!errors.items?.[index]?.serviceId}
                />
                {errors.items?.[index]?.serviceId && (
                  <p className="text-sm text-destructive">
                    {errors.items?.[index]?.serviceId?.message}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                {index === 0 && <Label>Quantity</Label>}
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                    onChange: (e) =>
                      handleQuantityChange(index, parseFloat(e.target.value) || 0),
                  })}
                  aria-invalid={!!errors.items?.[index]?.quantity}
                />
                {errors.items?.[index]?.quantity && (
                  <p className="text-sm text-destructive">
                    {errors.items?.[index]?.quantity?.message}
                  </p>
                )}
              </div>

              {/* Rate */}
              <div className="space-y-2">
                {index === 0 && <Label>Rate</Label>}
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.rate`, {
                    valueAsNumber: true,
                    onChange: (e) =>
                      handleRateChange(index, parseFloat(e.target.value) || 0),
                  })}
                  aria-invalid={!!errors.items?.[index]?.rate}
                />
                {errors.items?.[index]?.rate && (
                  <p className="text-sm text-destructive">
                    {errors.items?.[index]?.rate?.message}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="space-y-2">
                {index === 0 && <Label>Total</Label>}
                <Input
                  type="number"
                  readOnly
                  value={`$${(
                    (watchItems[index]?.quantity || 0) *
                    (watchItems[index]?.rate || 0)
                  ).toLocaleString()}`}
                  className="bg-muted"
                />
              </div>

              {/* Remove */}
              <div className="space-y-2">
                {index === 0 && <Label className="invisible">Remove</Label>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Charges & Discount */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Adjustments</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="additionalCharges">Additional Charges ($)</Label>
            <Input
              id="additionalCharges"
              type="number"
              step="0.01"
              min="0"
              {...register("additionalCharges", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount ($)</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              min="0"
              {...register("discount", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Services Total</span>
            <span>${itemsTotal.toLocaleString()}</span>
          </div>
          {(watchAdditionalCharges || 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Additional Charges</span>
              <span>+${(watchAdditionalCharges || 0).toLocaleString()}</span>
            </div>
          )}
          {(watchDiscount || 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-destructive">
                -${(watchDiscount || 0).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Amount</span>
            <span>${totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Terms & Notes */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Terms & Notes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              placeholder="Payment terms, warranty information, etc."
              rows={6}
              {...register("terms")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this proposal..."
              rows={6}
              {...register("notes")}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {proposal ? "Update Proposal" : "Create Proposal"}
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
