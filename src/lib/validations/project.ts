import { z } from "zod";

export const projectItemSchema = z.object({
  id: z.string().optional(),
  serviceId: z.string().min(1, "Service is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  rate: z.number().min(0, "Rate must be a positive number"),
  totalAmount: z.number().min(0, "Total must be a positive number"),
});

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  customerId: z.string().min(1, "Customer is required"),
  location: z
    .string()
    .max(500, "Location must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  status: z.enum(["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"]).default("PLANNED"),
  startDate: z.string().optional().or(z.literal("")),
  expectedEndDate: z.string().optional().or(z.literal("")),
  actualEndDate: z.string().optional().or(z.literal("")),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  items: z.array(projectItemSchema).min(1, "At least one project item is required"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectItemFormData = z.infer<typeof projectItemSchema>;

export const projectSearchSchema = z.object({
  query: z.string().optional(),
  status: z
    .enum(["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"])
    .optional(),
  customerId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type ProjectSearchParams = z.infer<typeof projectSearchSchema>;
