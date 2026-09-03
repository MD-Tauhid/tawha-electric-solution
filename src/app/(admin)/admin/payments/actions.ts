"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import {
  paymentSchema,
  type PaymentFormData,
  paymentSearchSchema,
  type PaymentSearchParams,
} from "@/lib/validations/payment";

export type PaymentListResult = {
  payments: Array<{
    id: string;
    amount: unknown;
    paymentDate: Date;
    method: string;
    reference: string | null;
    notes: string | null;
    createdAt: Date;
    bill: {
      id: string;
      billNumber: string;
      payableAmount: unknown;
      project: {
        id: string;
        projectNumber: string;
        name: string;
        customer: {
          id: string;
          name: string;
          companyName: string | null;
        };
      };
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getPayments(
  params: PaymentSearchParams
): Promise<PaymentListResult> {
  await requireAdmin();

  const validated = paymentSearchSchema.parse(params);
  const { query, method, billId, projectId, page, limit } = validated;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { bill: { billNumber: { contains: query, mode: "insensitive" } } },
      {
        bill: {
          project: { projectNumber: { contains: query, mode: "insensitive" } },
        },
      },
      {
        bill: {
          project: { name: { contains: query, mode: "insensitive" } },
        },
      },
      {
        bill: {
          project: {
            customer: { name: { contains: query, mode: "insensitive" } },
          },
        },
      },
      {
        bill: {
          project: {
            customer: {
              companyName: { contains: query, mode: "insensitive" },
            },
          },
        },
      },
      { reference: { contains: query, mode: "insensitive" } },
    ];
  }

  if (method) {
    where.method = method;
  }

  if (billId) {
    where.billId = billId;
  }

  if (projectId) {
    where.bill = { projectId };
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { paymentDate: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        amount: true,
        paymentDate: true,
        method: true,
        reference: true,
        notes: true,
        createdAt: true,
        bill: {
          select: {
            id: true,
            billNumber: true,
            payableAmount: true,
            project: {
              select: {
                id: true,
                projectNumber: true,
                name: true,
                customer: {
                  select: {
                    id: true,
                    name: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPayment(id: string) {
  await requireAdmin();

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      bill: {
        include: {
          project: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  companyName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
}

export type BillForPaymentSelect = {
  id: string;
  billNumber: string;
  payableAmount: number;
  status: string;
  label: string;
};

export async function getBillsForPaymentSelect(): Promise<BillForPaymentSelect[]> {
  await requireAdmin();

  const bills = await prisma.bill.findMany({
    where: {
      status: { notIn: ["PAID", "CANCELLED"] },
    },
    select: {
      id: true,
      billNumber: true,
      payableAmount: true,
      status: true,
      project: {
        select: {
          id: true,
          projectNumber: true,
          name: true,
          customer: {
            select: {
              id: true,
              name: true,
              companyName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Decimal fields to numbers for client serialization
  return bills.map((bill) => ({
    id: bill.id,
    billNumber: bill.billNumber,
    payableAmount: Number(bill.payableAmount),
    status: bill.status,
    label: `${bill.billNumber} - ${bill.project.projectNumber} - ${bill.project.customer.companyName || bill.project.customer.name}`,
  }));
}

export async function getBillPaymentSummary(billId: string) {
  await requireAdmin();

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    select: {
      id: true,
      billNumber: true,
      payableAmount: true,
      status: true,
    },
  });

  if (!bill) {
    throw new Error("Bill not found");
  }

  const totalPaid = await prisma.payment.aggregate({
    where: { billId },
    _sum: { amount: true },
  });

  const paidAmount = Number(totalPaid._sum.amount || 0);
  const payableAmount = Number(bill.payableAmount);
  const outstandingAmount = payableAmount - paidAmount;

  return {
    billId: bill.id,
    billNumber: bill.billNumber,
    payableAmount,
    paidAmount,
    outstandingAmount,
    status: bill.status,
  };
}

/**
 * Determine the appropriate bill status based on total payments.
 * Uses database transaction to ensure consistency.
 */
async function determineBillStatus(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  billId: string
): Promise<"DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "CANCELLED"> {
  const bill = await tx.bill.findUnique({
    where: { id: billId },
    select: { payableAmount: true, status: true },
  });

  if (!bill) {
    throw new Error("Bill not found");
  }

  // If bill is cancelled, don't auto-change status
  if (bill.status === "CANCELLED") {
    return "CANCELLED";
  }

  const totalPaid = await tx.payment.aggregate({
    where: { billId },
    _sum: { amount: true },
  });

  const paidAmount = Number(totalPaid._sum.amount || 0);
  const payableAmount = Number(bill.payableAmount);

  if (paidAmount <= 0) {
    // No payments - if was partially paid, revert to issued
    return bill.status === "PARTIALLY_PAID" ? "ISSUED" : bill.status;
  }

  if (paidAmount >= payableAmount) {
    return "PAID";
  }

  return "PARTIALLY_PAID";
}

export async function createPayment(data: PaymentFormData) {
  await requireAdmin();

  const validated = paymentSchema.parse(data);

  // Verify bill exists and is not cancelled
  const bill = await prisma.bill.findUnique({
    where: { id: validated.billId },
    select: {
      id: true,
      billNumber: true,
      payableAmount: true,
      status: true,
      projectId: true,
    },
  });

  if (!bill) {
    throw new Error("Bill not found");
  }

  if (bill.status === "CANCELLED") {
    throw new Error("Cannot record payment for a cancelled bill");
  }

  if (bill.status === "DRAFT") {
    throw new Error(
      "Cannot record payment for a draft bill. Please issue the bill first."
    );
  }

  // Calculate current total paid and validate overpayment
  const currentTotalPaid = await prisma.payment.aggregate({
    where: { billId: validated.billId },
    _sum: { amount: true },
  });

  const paidAmount = Number(currentTotalPaid._sum.amount || 0);
  const payableAmount = Number(bill.payableAmount);
  const outstandingAmount = payableAmount - paidAmount;

  if (validated.amount > outstandingAmount) {
    throw new Error(
      `Payment amount ($${validated.amount.toLocaleString()}) exceeds outstanding balance ($${outstandingAmount.toLocaleString()}). Overpayments are not allowed.`
    );
  }

  // Create payment and update bill status in a transaction
  const payment = await prisma.$transaction(async (tx) => {
    // Create the payment
    const newPayment = await tx.payment.create({
      data: {
        amount: validated.amount,
        paymentDate: new Date(validated.paymentDate),
        method: validated.method,
        reference: validated.reference || null,
        notes: validated.notes || null,
        billId: validated.billId,
      },
    });

    // Auto-determine bill status
    const newStatus = await determineBillStatus(tx, validated.billId);
    await tx.bill.update({
      where: { id: validated.billId },
      data: { status: newStatus },
    });

    return newPayment;
  });

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/bills/${validated.billId}`);
  revalidatePath(`/admin/projects/${bill.projectId}`);
  redirect(`/admin/payments/${payment.id}`);
}

export async function deletePayment(id: string) {
  await requireAdmin();

  const existing = await prisma.payment.findUnique({
    where: { id },
    select: {
      id: true,
      billId: true,
    },
  });

  if (!existing) {
    throw new Error("Payment not found");
  }

  const bill = await prisma.bill.findUnique({
    where: { id: existing.billId },
    select: {
      id: true,
      projectId: true,
      status: true,
    },
  });

  if (!bill) {
    throw new Error("Bill not found");
  }

  // Delete payment and update bill status in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.payment.delete({ where: { id } });

    // Auto-determine bill status after deletion
    const newStatus = await determineBillStatus(tx, existing.billId);
    await tx.bill.update({
      where: { id: existing.billId },
      data: { status: newStatus },
    });
  });

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/bills/${existing.billId}`);
  revalidatePath(`/admin/projects/${bill.projectId}`);
  redirect("/admin/payments");
}
