"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import {
  proposalSchema,
  type ProposalFormData,
  proposalSearchSchema,
  type ProposalSearchParams,
} from "@/lib/validations/proposal";

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

function generateProposalNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PROP-${year}${month}-${random}`;
}

/**
 * Turns the form's "existing id OR typed name" fields into real IDs.
 * - Reuses an existing customer/service when the typed name matches one
 *   (case-insensitive), so typing "acme" won't create a duplicate "Acme".
 * - Creates a new record only when nothing matches.
 * - Reuses the same new service if it appears on several lines.
 * Must run inside a transaction so a failure doesn't leave orphan records.
 */
async function resolveCustomerAndItems(tx: Tx, validated: ProposalFormData) {
  // ---- Customer ----
  let customerId = validated.customerId;

  if (!customerId) {
    const name = validated.newCustomerName;

    const existingCustomer = await tx.customer.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      select: { id: true },
    });

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const created = await tx.customer.create({
        data: { name },
        select: { id: true },
      });
      customerId = created.id;
    }
  }

  // ---- Services / items ----
  const newServiceIds = new Map<string, string>(); // lowercased name -> id

  const items: Array<{
    serviceId: string;
    quantity: number;
    rate: number;
    totalAmount: number;
  }> = [];

  for (const item of validated.items) {
    let serviceId = item.serviceId;

    if (!serviceId) {
      const key = item.serviceName.toLowerCase();
      const cached = newServiceIds.get(key);

      if (cached) {
        serviceId = cached;
      } else {
        const existingService = await tx.service.findFirst({
          where: { name: { equals: item.serviceName, mode: "insensitive" } },
          select: { id: true },
        });

        if (existingService) {
          serviceId = existingService.id;
        } else {
          const created = await tx.service.create({
            data: {
              name: item.serviceName,
              rate: item.rate,
            },
            select: { id: true },
          });
          serviceId = created.id;
        }

        newServiceIds.set(key, serviceId);
      }
    }

    items.push({
      serviceId,
      quantity: item.quantity,
      rate: item.rate,
      totalAmount: item.quantity * item.rate,
    });
  }

  return { customerId, items };
}

export type ProposalListResult = {
  proposals: Array<{
    id: string;
    proposalNumber: string;
    recipientName: string | null;
    projectName: string | null;
    totalAmount: unknown;
    createdAt: Date;
    customer: {
      id: string;
      name: string;
      companyName: string | null;
    };
    _count: {
      items: number;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getProposals(
  params: ProposalSearchParams
): Promise<ProposalListResult> {
  await requireAdmin();

  const validated = proposalSearchSchema.parse(params);
  const { query, customerId, page, limit } = validated;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { proposalNumber: { contains: query, mode: "insensitive" } },
      { recipientName: { contains: query, mode: "insensitive" } },
      { projectName: { contains: query, mode: "insensitive" } },
      { customer: { name: { contains: query, mode: "insensitive" } } },
      { customer: { companyName: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (customerId) {
    where.customerId = customerId;
  }

  const [proposals, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        proposalNumber: true,
        recipientName: true,
        projectName: true,
        totalAmount: true,
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
          },
        },
      },
    }),
    prisma.proposal.count({ where }),
  ]);

  return {
    proposals,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProposal(id: string) {
  await requireAdmin();

  const proposal = await prisma.proposal.findUnique({
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
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  return proposal;
}

export async function createProposal(data: ProposalFormData) {
  await requireAdmin();

  const validated = proposalSchema.parse(data);

  // Calculate total amount on the server
  const itemsTotal = validated.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const totalAmount =
    itemsTotal + validated.additionalCharges - validated.discount;

  // Generate unique proposal number
  let proposalNumber = generateProposalNumber();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.proposal.findUnique({
      where: { proposalNumber },
    });
    if (!existing) break;
    proposalNumber = generateProposalNumber();
    attempts++;
  }

  // Create any new customer/services and the proposal in one transaction
  const proposal = await prisma.$transaction(async (tx) => {
    const { customerId, items } = await resolveCustomerAndItems(tx, validated);

    return tx.proposal.create({
      data: {
        proposalNumber,
        recipientName: validated.recipientName || null,
        recipientAddress: validated.recipientAddress || null,
        customerId,
        projectName: validated.projectName || null,
        projectAddress: validated.projectAddress || null,
        additionalCharges: validated.additionalCharges,
        discount: validated.discount,
        totalAmount,
        terms: validated.terms || null,
        notes: validated.notes || null,
        items: {
          create: items,
        },
      },
    });
  });

  revalidatePath("/admin/proposals");
  redirect(`/admin/proposals/${proposal.id}`);
}

export async function updateProposal(id: string, data: ProposalFormData) {
  await requireAdmin();

  const validated = proposalSchema.parse(data);

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Proposal not found");
  }

  // Calculate total amount on the server
  const itemsTotal = validated.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const totalAmount =
    itemsTotal + validated.additionalCharges - validated.discount;

  // Update proposal with items in a transaction
  await prisma.$transaction(async (tx) => {
    const { customerId, items } = await resolveCustomerAndItems(tx, validated);

    // Delete existing items
    await tx.proposalItem.deleteMany({ where: { proposalId: id } });

    // Update proposal and create new items
    await tx.proposal.update({
      where: { id },
      data: {
        recipientName: validated.recipientName || null,
        recipientAddress: validated.recipientAddress || null,
        customerId,
        projectName: validated.projectName || null,
        projectAddress: validated.projectAddress || null,
        additionalCharges: validated.additionalCharges,
        discount: validated.discount,
        totalAmount,
        terms: validated.terms || null,
        notes: validated.notes || null,
        items: {
          create: items,
        },
      },
    });
  });

  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${id}`);
  redirect(`/admin/proposals/${id}`);
}

export async function deleteProposal(id: string) {
  await requireAdmin();

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Proposal not found");
  }

  // Delete proposal items first, then the proposal
  await prisma.$transaction(async (tx) => {
    await tx.proposalItem.deleteMany({ where: { proposalId: id } });
    await tx.proposal.delete({ where: { id } });
  });

  revalidatePath("/admin/proposals");
  redirect("/admin/proposals");
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