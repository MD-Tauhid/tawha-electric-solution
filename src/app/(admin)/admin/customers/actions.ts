"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import {
  customerSchema,
  type CustomerFormData,
  customerSearchSchema,
  type CustomerSearchParams,
} from "@/lib/validations/customer";

export type CustomerListResult = {
  customers: Array<{
    id: string;
    name: string;
    companyName: string | null;
    email: string | null;
    phone: string | null;
    type: string;
    createdAt: Date;
    _count: {
      projects: number;
      proposals: number;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getCustomers(
  params: CustomerSearchParams
): Promise<CustomerListResult> {
  await requireAdmin();

  const validated = customerSearchSchema.parse(params);
  const { query, type, page, limit } = validated;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { companyName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { phone: { contains: query, mode: "insensitive" } },
    ];
  }

  if (type) {
    where.type = type;
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        companyName: true,
        email: true,
        phone: true,
        type: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            proposals: true,
          },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    customers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCustomer(id: string) {
  await requireAdmin();

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      projects: {
        select: {
          id: true,
          projectNumber: true,
          name: true,
          status: true,
          totalValue: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      proposals: {
        select: {
          id: true,
          proposalNumber: true,
          projectName: true,
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          projects: true,
          proposals: true,
        },
      },
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
}

export async function createCustomer(data: CustomerFormData) {
  await requireAdmin();

  const validated = customerSchema.parse(data);

  const customer = await prisma.customer.create({
    data: {
      name: validated.name,
      companyName: validated.companyName || null,
      email: validated.email || null,
      phone: validated.phone || null,
      address: validated.address || null,
      city: validated.city || null,
      state: validated.state || null,
      zipCode: validated.zipCode || null,
      type: validated.type,
      notes: validated.notes || null,
    },
  });

  revalidatePath("/admin/customers");
  redirect(`/admin/customers/${customer.id}`);
}

export async function updateCustomer(id: string, data: CustomerFormData) {
  await requireAdmin();

  const validated = customerSchema.parse(data);

  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Customer not found");
  }

  await prisma.customer.update({
    where: { id },
    data: {
      name: validated.name,
      companyName: validated.companyName || null,
      email: validated.email || null,
      phone: validated.phone || null,
      address: validated.address || null,
      city: validated.city || null,
      state: validated.state || null,
      zipCode: validated.zipCode || null,
      type: validated.type,
      notes: validated.notes || null,
    },
  });

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
  redirect(`/admin/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  await requireAdmin();

  const existing = await prisma.customer.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          projects: true,
          proposals: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Customer not found");
  }

  if (existing._count.projects > 0 || existing._count.proposals > 0) {
    throw new Error(
      "Cannot delete customer with existing projects or proposals. Please remove them first."
    );
  }

  await prisma.customer.delete({ where: { id } });

  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}
