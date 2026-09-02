import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { generateBillPDF } from "@/lib/pdf/bill";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            projectNumber: true,
            name: true,
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
          },
        },
      },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    const pdfBuffer = await generateBillPDF({
      billNumber: bill.billNumber,
      area: bill.area,
      rate: bill.rate,
      totalAmount: bill.totalAmount,
      percentage: bill.percentage,
      payableAmount: bill.payableAmount,
      status: bill.status,
      notes: bill.notes,
      createdAt: bill.createdAt,
      project: bill.project,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${bill.billNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate bill PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
