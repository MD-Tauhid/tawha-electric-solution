import { z } from "zod";

export const proposalItemSchema = z.object({
  id: z.string().optional(),
  serviceId: z.string().min(1, "Service is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  rate: z.number().min(0, "Rate must be a positive number"),
  totalAmount: z.number().min(0, "Total must be a positive number"),
});

export const proposalSchema = z.object({
  recipientName: z
    .string()
    .max(255, "Recipient name must be 255 characters or less")
    .optional()
    .or(z.literal("")),
  recipientAddress: z
    .string()
    .max(500, "Recipient address must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  customerId: z.string().min(1, "Customer is required"),
  projectName: z
    .string()
    .max(255, "Project name must be 255 characters or less")
    .optional()
    .or(z.literal("")),
  projectAddress: z
    .string()
    .max(500, "Project address must be 500 characters or less")
    .optional()
    .or(z.literal("")),
  additionalCharges: z
    .number()
    .min(0, "Additional charges must be a positive number")
    .default(0),
  discount: z
    .number()
    .min(0, "Discount must be a positive number")
    .default(0),
  terms: z
    .string()
    .max(5000, "Terms must be 5000 characters or less")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  items: z.array(proposalItemSchema).min(1, "At least one proposal item is required"),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;
export type ProposalItemFormData = z.infer<typeof proposalItemSchema>;

export const proposalSearchSchema = z.object({
  query: z.string().optional(),
  customerId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type ProposalSearchParams = z.infer<typeof proposalSearchSchema>;
