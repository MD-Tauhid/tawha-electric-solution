import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  companyName: z
    .string()
    .max(255, "Company name must be 255 characters or less")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be 255 characters or less")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(50, "Phone must be 50 characters or less")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Address must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(100, "City must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(100, "State must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  zipCode: z
    .string()
    .max(20, "Zip code must be 20 characters or less")
    .optional()
    .or(z.literal("")),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "RESTAURANT", "OTHER"]),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const customerSearchSchema = z.object({
  query: z.string().optional(),
  type: z
    .enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "RESTAURANT", "OTHER"])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CustomerSearchParams = z.infer<typeof customerSearchSchema>;
