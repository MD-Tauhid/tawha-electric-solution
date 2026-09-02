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
  projectSchema,
  type ProjectFormData,
} from "@/lib/validations/project";

const projectStatusOptions = [
  { value: "PLANNED", label: "Planned" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

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

interface ProjectFormProps {
  project?: {
    id: string;
    name: string;
    description: string | null;
    customerId: string;
    location: string | null;
    status: string;
    startDate: Date | null;
    expectedEndDate: Date | null;
    actualEndDate: Date | null;
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
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectForm({
  project,
  customers,
  services,
  onSubmit,
}: ProjectFormProps) {
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
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as never,
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      customerId: project?.customerId ?? "",
      location: project?.location ?? "",
      status: (project?.status as "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED") ?? "PLANNED",
      startDate: project?.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      expectedEndDate: project?.expectedEndDate
        ? new Date(project.expectedEndDate).toISOString().split("T")[0]
        : "",
      actualEndDate: project?.actualEndDate
        ? new Date(project.actualEndDate).toISOString().split("T")[0]
        : "",
      notes: project?.notes ?? "",
      items: project?.items.map((item) => ({
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

  // Calculate total value
  const totalValue = watchItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0
  );

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

  async function handleFormSubmit(data: ProjectFormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        project ? "Project updated successfully" : "Project created successfully"
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
      {/* Basic Info */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Project Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Office Building Wiring"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

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

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              options={projectStatusOptions}
              {...register("status")}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="123 Main St, New York, NY"
              {...register("location")}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Project description..."
            rows={3}
            {...register("description")}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Schedule</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              {...register("startDate")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedEndDate">Expected End Date</Label>
            <Input
              id="expectedEndDate"
              type="date"
              {...register("expectedEndDate")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualEndDate">Actual End Date</Label>
            <Input
              id="actualEndDate"
              type="date"
              {...register("actualEndDate")}
            />
          </div>
        </div>
      </div>

      {/* Project Items */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Project Items</h2>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
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

        {/* Total Value */}
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Project Value</p>
            <p className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Notes</h2>
        <Textarea
          id="notes"
          placeholder="Additional notes about this project..."
          rows={4}
          {...register("notes")}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {project ? "Update Project" : "Create Project"}
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
