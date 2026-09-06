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
  companySettingsSchema,
  type CompanySettingsFormData,
} from "@/lib/validations/settings";
import type { CompanySettingsData } from "@/lib/company-settings";

interface SettingsFormProps {
  settings: CompanySettingsData;
  onSubmit: (data: CompanySettingsFormData) => Promise<void>;
}

export function SettingsForm({ settings, onSubmit }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanySettingsFormData>({
    resolver: zodResolver(companySettingsSchema) as never,
    defaultValues: {
      companyName: settings.companyName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      whatsapp: settings.whatsapp,
      facebook: settings.facebook,
      instagram: settings.instagram,
      googleMapsUrl: settings.googleMapsUrl,
      businessHours: settings.businessHours,
    },
  });

  async function handleFormSubmit(data: CompanySettingsFormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success("Company settings updated successfully");
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
      {/* Company name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">
          Company Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="companyName"
          placeholder="Tawha Electrical Solution"
          {...register("companyName")}
          aria-invalid={!!errors.companyName}
        />
        {errors.companyName && (
          <p className="text-sm text-destructive">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+880 1XXX-XXXXXX"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="info@tawhaelectrical.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          placeholder="Street, City, Country"
          rows={2}
          {...register("address")}
          aria-invalid={!!errors.address}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* WhatsApp */}
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            placeholder="https://wa.me/8801XXXXXXXXX"
            {...register("whatsapp")}
            aria-invalid={!!errors.whatsapp}
          />
          {errors.whatsapp && (
            <p className="text-sm text-destructive">
              {errors.whatsapp.message}
            </p>
          )}
        </div>

        {/* Facebook */}
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            placeholder="https://facebook.com/tawhaelectrical"
            {...register("facebook")}
            aria-invalid={!!errors.facebook}
          />
          {errors.facebook && (
            <p className="text-sm text-destructive">
              {errors.facebook.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Instagram */}
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            placeholder="https://instagram.com/tawhaelectrical"
            {...register("instagram")}
            aria-invalid={!!errors.instagram}
          />
          {errors.instagram && (
            <p className="text-sm text-destructive">
              {errors.instagram.message}
            </p>
          )}
        </div>

        {/* Google Maps URL */}
        <div className="space-y-2">
          <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
          <Input
            id="googleMapsUrl"
            placeholder="https://maps.app.goo.gl/..."
            {...register("googleMapsUrl")}
            aria-invalid={!!errors.googleMapsUrl}
          />
          {errors.googleMapsUrl && (
            <p className="text-sm text-destructive">
              {errors.googleMapsUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Business hours */}
      <div className="space-y-2">
        <Label htmlFor="businessHours">Business Hours</Label>
        <Input
          id="businessHours"
          placeholder="Sat–Thu: 9:00 AM – 6:00 PM"
          {...register("businessHours")}
          aria-invalid={!!errors.businessHours}
        />
        {errors.businessHours && (
          <p className="text-sm text-destructive">
            {errors.businessHours.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          Save Settings
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