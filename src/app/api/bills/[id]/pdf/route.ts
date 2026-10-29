import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { generateBillPDF } from "@/lib/pdf/bill";
import { amountInWordsBD } from "@/lib/numberToWordBd";

// Read once, reuse on every request.
const logoBuffer = fs.readFileSync(
  path.join(process.cwd(), "public", "brand", "logo-bg-less.png"),
);

// Optional: font that contains the Taka sign (৳). Falls back to "Tk" if missing.
const takaFontPath = path.join(
  process.cwd(),
  "public",
  "fonts",
  "NotoSansBengali-Regular.ttf",
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const customer = bill.project.customer;
    const payable = Math.round(Number(bill.payableAmount));

    // "To" block: name/company, address, city/zip
    const cityLine = [customer.city, customer.state, customer.zipCode]
      .filter(Boolean)
      .join(", ");
    const recipient = [
      customer.companyName || customer.name,
      customer.address,
      cityLine,
    ].filter((l): l is string => !!l);

    const pdfBuffer = await generateBillPDF(
      {
        company: {
          name: "Taw-ha Electric Solution",
          tagline:
            "The Solution of all industrial, household electrical materials & installations",
          proprietor: "Proprietor: Mofijur Rahman",
          address: "Mostul,khilkhet,Dhaka | Cell: 01825-297424",
          logo: logoBuffer,
        },
        date: bill.createdAt,
        recipient,
        // The generator already prints the "Subject:" label
        subject: `Bill for ${bill.project.name} (${bill.project.projectNumber})`,
        heading: `Bill for ${bill.project.name} (${bill.project.projectNumber})`,
        areaLabel: `Total area = ${Number(bill.area)} sft`,
        percentage: String(bill.percentage),
        items: [
          {
            description: `Electrical work for ${bill.project.name}`,
            quantity: Number(bill.area),
            unit: "SFT",
            rate: Number(bill.rate),
            total: Math.round(Number(bill.totalAmount)),
            payable,
          },
        ],
        // Add real dues here when you have them, e.g.
        // [{ description: "6th floor due", calculation: "11,541 – 9,000", amount: 2541 }]
        dues: [],
        payableAmount: payable,
        amountInWords: amountInWordsBD(payable),
        // The generator already prints the "Payment Information:" heading
        paymentInfo: [
          "Ac no: 1991580036824 (DBBL)",
          "Ac Name: Mofijur Rahman",
          "Branch: Sonargaon Janapath branch",
        ],
        closing: {
          regards: "Thanks with Best Regards",
          name: "Mofijur Rahman",
          phone: "+88 01825-297424",
        },
      },
      { takaFontPath },
    );

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
      { status: 500 },
    );
  }
}