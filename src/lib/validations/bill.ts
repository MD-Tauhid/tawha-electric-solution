import { z } from "zod";

export const billSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  area: z.number().min(0.01, "Area must be greater than 0"),
  rate: z.number().min(0, "Rate must be a positive number"),
  percentage: z
    .number()
    .min(0.01, "Percentage must be greater than 0")
    .max(100, "Percentage cannot exceed 100"),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
});

export type BillFormData = z.infer<typeof billSchema>;

export const billSearchSchema = z.object({
  query: z.string().optional(),
  status: z
    .enum(["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "CANCELLED"])
    .optional(),
  projectId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type BillSearchParams = z.infer<typeof billSearchSchema>;
