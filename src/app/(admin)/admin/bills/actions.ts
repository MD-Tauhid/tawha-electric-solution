"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import {
  billSchema,
  type BillFormData,
  billSearchSchema,
  type BillSearchParams,
} from "@/lib/validations/bill";

function generateBillNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `BILL-${year}${month}-${random}`;
}

export type BillListResult = {
  bills: Array<{
    id: string;
    billNumber: string;
    totalAmount: unknown;
    payableAmount: unknown;
    status: string;
    percentage: unknown;
    createdAt: Date;
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
    _count: {
      payments: number;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getBills(
  params: BillSearchParams
): Promise<BillListResult> {
  await requireAdmin();

  const validated = billSearchSchema.parse(params);
  const { query, status, projectId, page, limit } = validated;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { billNumber: { contains: query, mode: "insensitive" } },
      { project: { projectNumber: { contains: query, mode: "insensitive" } } },
      { project: { name: { contains: query, mode: "insensitive" } } },
      {
        project: {
          customer: { name: { contains: query, mode: "insensitive" } },
        },
      },
      {
        project: {
          customer: {
            companyName: { contains: query, mode: "insensitive" },
          },
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (projectId) {
    where.projectId = projectId;
  }

  const [bills, total] = await Promise.all([
    prisma.bill.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        billNumber: true,
        totalAmount: true,
        payableAmount: true,
        status: true,
        percentage: true,
        createdAt: true,
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
        _count: {
          select: {
            payments: true,
          },
        },
      },
    }),
    prisma.bill.count({ where }),
  ]);

  return {
    bills,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBill(id: string) {
  await requireAdmin();

  const bill = await prisma.bill.findUnique({
    where: { id },
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
              address: true,
              city: true,
              state: true,
              zipCode: true,
            },
          },
          items: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  unit: true,
                },
              },
            },
            orderBy: { id: "asc" },
          },
        },
      },
      payments: {
        orderBy: { paymentDate: "desc" },
      },
    },
  });

  if (!bill) {
    throw new Error("Bill not found");
  }

  return bill;
}

export async function getProjectsForBillSelect() {
  await requireAdmin();

  return prisma.project.findMany({
    where: {
      status: { notIn: ["CANCELLED"] },
    },
    select: {
      id: true,
      projectNumber: true,
      name: true,
      totalValue: true,
      customer: {
        select: {
          id: true,
          name: true,
          companyName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectForBill(projectId: string) {
  await requireAdmin();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      projectNumber: true,
      name: true,
      totalValue: true,
      location: true,
      customer: {
        select: {
          id: true,
          name: true,
          companyName: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
        },
      },
      items: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function createBill(data: BillFormData) {
  await requireAdmin();

  const validated = billSchema.parse(data);

  // Verify project exists
  const project = await prisma.project.findUnique({
    where: { id: validated.projectId },
    select: { id: true, projectNumber: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Server-side calculation: Total Amount = Area × Rate
  const totalAmount = validated.area * validated.rate;
  // Payable Amount = Total Amount × Percentage / 100
  const payableAmount = (totalAmount * validated.percentage) / 100;

  // Generate unique bill number
  let billNumber = generateBillNumber();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.bill.findUnique({
      where: { billNumber },
    });
    if (!existing) break;
    billNumber = generateBillNumber();
    attempts++;
  }

  const bill = await prisma.bill.create({
    data: {
      billNumber,
      area: validated.area,
      rate: validated.rate,
      totalAmount,
      percentage: validated.percentage,
      payableAmount,
      status: "DRAFT",
      notes: validated.notes || null,
      projectId: validated.projectId,
    },
  });

  revalidatePath("/admin/bills");
  revalidatePath(`/admin/projects/${validated.projectId}`);
  redirect(`/admin/bills/${bill.id}`);
}

export async function updateBillStatus(
  id: string,
  status: "DRAFT" | "ISSUED" | "PARTIALLY_PAID" | "PAID" | "CANCELLED"
) {
  await requireAdmin();

  const existing = await prisma.bill.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Bill not found");
  }

  // Prevent setting to PAID if there are outstanding payments
  if (status === "PAID") {
    const totalPaid = await prisma.payment.aggregate({
      where: { billId: id },
      _sum: { amount: true },
    });
    const paidAmount = Number(totalPaid._sum.amount || 0);
    if (paidAmount < Number(existing.payableAmount)) {
      throw new Error(
        "Cannot mark as paid: outstanding balance remains. Record all payments first."
      );
    }
  }

  await prisma.bill.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/bills");
  revalidatePath(`/admin/bills/${id}`);
  revalidatePath(`/admin/projects/${existing.projectId}`);
}

export async function deleteBill(id: string) {
  await requireAdmin();

  const existing = await prisma.bill.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          payments: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Bill not found");
  }

  if (existing._count.payments > 0) {
    throw new Error(
      "Cannot delete bill with existing payments. Please remove them first."
    );
  }

  const projectId = existing.projectId;

  await prisma.bill.delete({ where: { id } });

  revalidatePath("/admin/bills");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect("/admin/bills");
}
