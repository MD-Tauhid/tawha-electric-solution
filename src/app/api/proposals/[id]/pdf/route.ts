import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { generateProposalPDF } from "@/lib/pdf/proposal";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
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
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateProposalPDF({
      proposalNumber: proposal.proposalNumber,
      recipientName: proposal.recipientName,
      recipientAddress: proposal.recipientAddress,
      projectName: proposal.projectName,
      projectAddress: proposal.projectAddress,
      customer: proposal.customer,
      items: proposal.items,
      additionalCharges: proposal.additionalCharges,
      discount: proposal.discount,
      totalAmount: proposal.totalAmount,
      terms: proposal.terms,
      notes: proposal.notes,
      createdAt: proposal.createdAt,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${proposal.proposalNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate proposal PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
