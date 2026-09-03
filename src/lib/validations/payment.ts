import { z } from "zod";

export const paymentSchema = z.object({
  billId: z.string().min(1, "Bill is required"),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(999999999, "Amount is too large"),
  paymentDate: z.string().min(1, "Payment date is required"),
  method: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_BANKING", "CHEQUE", "OTHER"], {
    message: "Payment method is required",
  }),
  reference: z
    .string()
    .max(200, "Reference must be 200 characters or less")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const paymentSearchSchema = z.object({
  query: z.string().optional(),
  method: z
    .enum(["CASH", "BANK_TRANSFER", "MOBILE_BANKING", "CHEQUE", "OTHER"])
    .optional(),
  billId: z.string().optional(),
  projectId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type PaymentSearchParams = z.infer<typeof paymentSearchSchema>;
