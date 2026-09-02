"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import {
  serviceSchema,
  type ServiceFormData,
} from "@/lib/validations/service";

export type ServiceListResult = {
  services: Array<{
    id: string;
    name: string;
    description: string | null;
    rate: unknown;
    unit: string;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: Date;
    _count: {
      projectItems: number;
      proposalItems: number;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getServices(params: {
  query?: string;
  isActive?: string;
  isFeatured?: string;
  page?: number;
  limit?: number;
}): Promise<ServiceListResult> {
  await requireAdmin();

  const { query, isActive, isFeatured, page = 1, limit = 10 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive === "true";
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured === "true";
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        rate: true,
        unit: true,
        isActive: true,
        isFeatured: true,
        createdAt: true,
        _count: {
          select: {
            projectItems: true,
            proposalItems: true,
          },
        },
      },
    }),
    prisma.service.count({ where }),
  ]);

  return {
    services,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getService(id: string) {
  await requireAdmin();

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          projectItems: true,
          proposalItems: true,
        },
      },
    },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return service;
}

export async function createService(data: ServiceFormData) {
  await requireAdmin();

  const validated = serviceSchema.parse(data);

  const service = await prisma.service.create({
    data: {
      name: validated.name,
      description: validated.description || null,
      rate: validated.rate,
      unit: validated.unit,
      isActive: validated.isActive,
      isFeatured: validated.isFeatured,
    },
  });

  revalidatePath("/admin/services");
  redirect(`/admin/services/${service.id}`);
}

export async function updateService(id: string, data: ServiceFormData) {
  await requireAdmin();

  const validated = serviceSchema.parse(data);

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Service not found");
  }

  await prisma.service.update({
    where: { id },
    data: {
      name: validated.name,
      description: validated.description || null,
      rate: validated.rate,
      unit: validated.unit,
      isActive: validated.isActive,
      isFeatured: validated.isFeatured,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
  redirect(`/admin/services/${id}`);
}

export async function deleteService(id: string) {
  await requireAdmin();

  const existing = await prisma.service.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          projectItems: true,
          proposalItems: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Service not found");
  }

  if (existing._count.projectItems > 0 || existing._count.proposalItems > 0) {
    throw new Error(
      "Cannot delete service with existing project items or proposal items. Please remove them first."
    );
  }

  await prisma.service.delete({ where: { id } });

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function toggleServiceActive(id: string) {
  await requireAdmin();

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Service not found");
  }

  await prisma.service.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
}

export async function toggleServiceFeatured(id: string) {
  await requireAdmin();

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Service not found");
  }

  await prisma.service.update({
    where: { id },
    data: { isFeatured: !existing.isFeatured },
  });

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
}
