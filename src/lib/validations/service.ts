import { z } from "zod";

export const serviceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  rate: z
    .number()
    .min(0, "Rate must be a positive number")
    .max(999999999999.99, "Rate is too large"),
  unit: z.string().max(50, "Unit must be 50 characters or less").default("sq ft"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const serviceSearchSchema = z.object({
  query: z.string().optional(),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
  isFeatured: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type ServiceSearchParams = z.infer<typeof serviceSearchSchema>;
