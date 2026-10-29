import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { generateProposalPDF } from "@/lib/pdf/proposal";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Read once, reuse on every request.
const logoBuffer = fs.readFileSync(
  path.join(process.cwd(), "public", "brand", "logo-bg-less.png"),
);

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
          include: { service: { select: { name: true, unit: true } } },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const customer = proposal.customer;

    /* ----------------------------- rate (dynamic) ----------------------------- */
    // 1) ?rate=26 in the URL wins  2) otherwise the first proposal item's rate
    const rateParam = Number(request.nextUrl.searchParams.get("rate"));
    const rate =
      Number.isFinite(rateParam) && rateParam > 0
        ? rateParam
        : Number(proposal.items[0]?.rate ?? 0);

    /* --------------------------- customer block (dynamic) --------------------------- */
    const splitLines = (s?: string | null) =>
      (s ?? "")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    let lines = [
      ...splitLines(proposal.recipientName),
      ...splitLines(proposal.recipientAddress),
    ];

    // Fallback to the customer record if the proposal has no recipient text
    if (!lines.length) {
      const cityLine = [customer.city, customer.state, customer.zipCode]
        .filter(Boolean)
        .join(", ");
      lines = [
        customer.companyName || customer.name,
        customer.address ?? "",
        cityLine,
      ]
        .map((l) => l.trim())
        .filter(Boolean);
    }

    const projectText = [proposal.projectName, proposal.projectAddress]
      .filter(Boolean)
      .join(", ");
    const subject = projectText
      ? `${projectText} - ইলেকট্রিক্যাল কাজের কোটেশন.`
      : "ইলেকট্রিক্যাল কাজের কোটেশন.";

    const pdfBuffer = await generateProposalPDF({
      company: { logo: logoBuffer },
      date: proposal.createdAt,
      recipient: { lines },
      subject,
      rate: { amount: rate },
      // Optional overrides – everything else comes from proposal-defaults.ts
      // paymentTerms: buildPaymentTerms([20, 35, 25, 20]),
      // clients: null, // hide the "সম্মানিত গ্রাহকগণ" page
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
      { status: 500 },
    );
  }
}