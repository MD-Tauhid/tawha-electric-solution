"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import {
  projectSchema,
  type ProjectFormData,
  projectSearchSchema,
  type ProjectSearchParams,
} from "@/lib/validations/project";

function generateProjectNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PRJ-${year}${month}-${random}`;
}

export type ProjectListResult = {
  projects: Array<{
    id: string;
    projectNumber: string;
    name: string;
    status: string;
    totalValue: unknown;
    startDate: Date | null;
    expectedEndDate: Date | null;
    createdAt: Date;
    customer: {
      id: string;
      name: string;
      companyName: string | null;
    };
    _count: {
      items: number;
      bills: number;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getProjects(
  params: ProjectSearchParams
): Promise<ProjectListResult> {
  await requireAdmin();

  const validated = projectSearchSchema.parse(params);
  const { query, status, customerId, page, limit } = validated;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { projectNumber: { contains: query, mode: "insensitive" } },
      { customer: { name: { contains: query, mode: "insensitive" } } },
      { customer: { companyName: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (customerId) {
    where.customerId = customerId;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        projectNumber: true,
        name: true,
        status: true,
        totalValue: true,
        startDate: true,
        expectedEndDate: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        _count: {
          select: {
            items: true,
            bills: true,
          },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProject(id: string) {
  await requireAdmin();

  const project = await prisma.project.findUnique({
    where: { id },
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
      bills: {
        select: {
          id: true,
          billNumber: true,
          totalAmount: true,
          payableAmount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          items: true,
          bills: true,
        },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function getActiveServices() {
  await requireAdmin();

  return prisma.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      rate: true,
      unit: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getActiveCustomers() {
  await requireAdmin();

  return prisma.customer.findMany({
    select: {
      id: true,
      name: true,
      companyName: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function createProject(data: ProjectFormData) {
  await requireAdmin();

  const validated = projectSchema.parse(data);

  // Calculate total value on the server
  const totalValue = validated.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  // Generate unique project number
  let projectNumber = generateProjectNumber();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.project.findUnique({
      where: { projectNumber },
    });
    if (!existing) break;
    projectNumber = generateProjectNumber();
    attempts++;
  }

  const project = await prisma.project.create({
    data: {
      projectNumber,
      name: validated.name,
      description: validated.description || null,
      customerId: validated.customerId,
      location: validated.location || null,
      status: validated.status,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      expectedEndDate: validated.expectedEndDate
        ? new Date(validated.expectedEndDate)
        : null,
      actualEndDate: validated.actualEndDate
        ? new Date(validated.actualEndDate)
        : null,
      notes: validated.notes || null,
      totalValue,
      items: {
        create: validated.items.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          rate: item.rate,
          totalAmount: item.quantity * item.rate,
        })),
      },
    },
  });

  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProject(id: string, data: ProjectFormData) {
  await requireAdmin();

  const validated = projectSchema.parse(data);

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Project not found");
  }

  // Calculate total value on the server
  const totalValue = validated.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  // Update project with items in a transaction
  await prisma.$transaction(async (tx) => {
    // Delete existing items
    await tx.projectItem.deleteMany({ where: { projectId: id } });

    // Update project and create new items
    await tx.project.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description || null,
        customerId: validated.customerId,
        location: validated.location || null,
        status: validated.status,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
        expectedEndDate: validated.expectedEndDate
          ? new Date(validated.expectedEndDate)
          : null,
        actualEndDate: validated.actualEndDate
          ? new Date(validated.actualEndDate)
          : null,
        notes: validated.notes || null,
        totalValue,
        items: {
          create: validated.items.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            rate: item.rate,
            totalAmount: item.quantity * item.rate,
          })),
        },
      },
    });
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  redirect(`/admin/projects/${id}`);
}

export async function deleteProject(id: string) {
  await requireAdmin();

  const existing = await prisma.project.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          bills: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Project not found");
  }

  if (existing._count.bills > 0) {
    throw new Error(
      "Cannot delete project with existing bills. Please remove them first."
    );
  }

  // Delete project items first, then the project
  await prisma.$transaction(async (tx) => {
    await tx.projectItem.deleteMany({ where: { projectId: id } });
    await tx.project.delete({ where: { id } });
  });

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProjectStatus(
  id: string,
  status: "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED"
) {
  await requireAdmin();

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Project not found");
  }

  const updateData: Record<string, unknown> = { status };

  // If marking as completed, set actual end date if not already set
  if (status === "COMPLETED" && !existing.actualEndDate) {
    updateData.actualEndDate = new Date();
  }

  await prisma.project.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
}
