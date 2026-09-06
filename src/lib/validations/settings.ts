import { z } from "zod";

export const companySettingsSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be 255 characters or less"),
  phone: z
    .string()
    .max(50, "Phone must be 50 characters or less")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .max(255, "Email must be 255 characters or less")
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Address must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .max(500, "WhatsApp link must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .max(500, "Facebook link must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .max(500, "Instagram link must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  googleMapsUrl: z
    .string()
    .max(1000, "Google Maps URL must be 1000 characters or less")
    .optional()
    .or(z.literal("")),
  businessHours: z
    .string()
    .max(500, "Business hours must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;