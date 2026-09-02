"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { billSchema, type BillFormData } from "@/lib/validations/bill";
import { createBill } from "../actions";

interface Project {
  id: string;
  projectNumber: string;
  name: string;
  totalValue: unknown;
  customer: {
    name: string;
    companyName: string | null;
  };
}

interface NewBillFormProps {
  projects: Project[];
}

export function NewBillForm({ projects }: NewBillFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const projectOptions = [
    { value: "", label: "Select a project" },
    ...projects.map((p) => ({
      value: p.id,
      label: `${p.projectNumber} - ${p.name} (${p.customer.companyName || p.customer.name})`,
    })),
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BillFormData>({
    resolver: zodResolver(billSchema) as never,
    defaultValues: {
      projectId: "",
      area: 0,
      rate: 0,
      percentage: 100,
      notes: "",
    },
  });

  const watchArea = watch("area");
  const watchRate = watch("rate");
  const watchPercentage = watch("percentage");

  // Client-side preview of the calculation (server recalculates)
  const totalAmount = (watchArea || 0) * (watchRate || 0);
  const payableAmount = (totalAmount * (watchPercentage || 0)) / 100;

  async function handleFormSubmit(data: BillFormData) {
    setIsSubmitting(true);
    try {
      await createBill(data);
      toast.success("Bill created successfully");
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
      {/* Project Selection */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Project</h2>
        <div className="space-y-2">
          <Label htmlFor="projectId">
            Select Project <span className="text-destructive">*</span>
          </Label>
          <Select
            id="projectId"
            options={projectOptions}
            {...register("projectId")}
            aria-invalid={!!errors.projectId}
          />
          {errors.projectId && (
            <p className="text-sm text-destructive">
              {errors.projectId.message}
            </p>
          )}
        </div>
      </div>

      {/* Bill Calculation */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Bill Calculation</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="area">
              Area (sq ft) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 5000"
              {...register("area", { valueAsNumber: true })}
              aria-invalid={!!errors.area}
            />
            {errors.area && (
              <p className="text-sm text-destructive">{errors.area.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">
              Rate ($/sq ft) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 120"
              {...register("rate", { valueAsNumber: true })}
              aria-invalid={!!errors.rate}
            />
            {errors.rate && (
              <p className="text-sm text-destructive">{errors.rate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentage">
              Percentage to Pay (%) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="e.g. 30"
              {...register("percentage", { valueAsNumber: true })}
              aria-invalid={!!errors.percentage}
            />
            {errors.percentage && (
              <p className="text-sm text-destructive">
                {errors.percentage.message}
              </p>
            )}
          </div>
        </div>

        {/* Calculation Preview */}
        <div className="mt-6 rounded-md bg-muted p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Calculation Preview</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="text-sm font-medium">
                {Number(watchArea || 0).toLocaleString()} × $
                {Number(watchRate || 0).toLocaleString()} = $
                {totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Percentage</p>
              <p className="text-sm font-medium">
                {Number(watchPercentage || 0).toLocaleString()}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payable Amount</p>
              <p className="text-lg font-bold text-primary">
                ${payableAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Notes</h2>
        <Textarea
          id="notes"
          placeholder="Additional notes about this bill..."
          rows={4}
          {...register("notes")}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          Create Bill
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
