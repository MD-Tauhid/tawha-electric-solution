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
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  serviceSchema,
  type ServiceFormData,
} from "@/lib/validations/service";
import type { Service } from "@prisma/client";

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: ServiceFormData) => Promise<void>;
}

export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema) as never,
    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      rate: service ? Number(service.rate) : 0,
      unit: service?.unit ?? "sq ft",
      isActive: service?.isActive ?? true,
      isFeatured: service?.isFeatured ?? false,
    },
  });

  async function handleFormSubmit(data: ServiceFormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        service ? "Service updated successfully" : "Service created successfully"
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
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Electrical Wiring"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Rate */}
        <div className="space-y-2">
          <Label htmlFor="rate">
            Rate <span className="text-destructive">*</span>
          </Label>
          <Input
            id="rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("rate", { valueAsNumber: true })}
            aria-invalid={!!errors.rate}
          />
          {errors.rate && (
            <p className="text-sm text-destructive">{errors.rate.message}</p>
          )}
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            placeholder="sq ft"
            {...register("unit")}
            aria-invalid={!!errors.unit}
          />
          {errors.unit && (
            <p className="text-sm text-destructive">{errors.unit.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description of the service..."
          rows={4}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            {...register("isActive")}
          />
          <span className="text-sm">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            {...register("isFeatured")}
          />
          <span className="text-sm">Featured</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          {service ? "Update Service" : "Create Service"}
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
