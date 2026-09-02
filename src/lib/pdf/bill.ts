import PDFDocument from "pdfkit";

interface BillPDFData {
  billNumber: string;
  area: unknown;
  rate: unknown;
  totalAmount: unknown;
  percentage: unknown;
  payableAmount: unknown;
  status: string;
  notes: string | null;
  createdAt: Date;
  project: {
    projectNumber: string;
    name: string;
    customer: {
      name: string;
      companyName: string | null;
      email: string | null;
      phone: string | null;
      address: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
    };
  };
}

export function generateBillPDF(data: BillPDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("BILL", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Bill #: ${data.billNumber}`, { align: "center" })
      .text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, {
        align: "center",
      })
      .text(`Status: ${data.status}`, { align: "center" })
      .moveDown(1);

    // Divider
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(0.5);

    // From/To Section
    const yStart = doc.y;

    // From (Customer info)
    doc.fontSize(10).font("Helvetica-Bold").text("BILL TO:", 50, yStart);
    doc.font("Helvetica").text(data.project.customer.name, 50, yStart + 15);
    if (data.project.customer.companyName) {
      doc.text(data.project.customer.companyName, 50, yStart + 30);
    }
    const fromY = data.project.customer.companyName ? yStart + 45 : yStart + 30;
    if (data.project.customer.email) {
      doc.text(data.project.customer.email, 50, fromY);
    }
    if (data.project.customer.phone) {
      doc.text(data.project.customer.phone, 50, fromY + 15);
    }

    // Project info
    doc.font("Helvetica-Bold").text("PROJECT:", 300, yStart);
    doc.font("Helvetica").text(data.project.projectNumber, 300, yStart + 15);
    doc.text(data.project.name, 300, yStart + 30);

    doc.y = Math.max(doc.y, yStart + 60);
    doc.moveDown(0.5);

    // Divider
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(0.5);

    // Bill Calculation Section
    doc.fontSize(10).font("Helvetica-Bold").text("BILL CALCULATION", 50, doc.y);
    doc.moveDown(0.3);

    const calcX = 50;
    const calcValueX = 300;
    const calcWidth = 245;

    doc.font("Helvetica").fontSize(10);
    doc.text("Area:", calcX, doc.y, { width: calcWidth - 150, align: "left" });
    doc.text(
      `${Number(data.area).toLocaleString()} sq ft`,
      calcValueX,
      doc.y - 14,
      { width: 150, align: "right" }
    );

    doc.text("Rate:", calcX, doc.y + 2, { width: calcWidth - 150, align: "left" });
    doc.text(
      `$${Number(data.rate).toLocaleString()} / sq ft`,
      calcValueX,
      doc.y - 14,
      { width: 150, align: "right" }
    );

    doc.moveDown(0.3);
    doc
      .moveTo(calcX, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold");
    doc.text("Total Amount:", calcX, doc.y, { width: calcWidth - 150, align: "left" });
    doc.text(
      `$${Number(data.totalAmount).toLocaleString()}`,
      calcValueX,
      doc.y - 14,
      { width: 150, align: "right" }
    );

    doc.moveDown(0.3);

    doc.font("Helvetica");
    doc.text("Percentage to Pay:", calcX, doc.y, { width: calcWidth - 150, align: "left" });
    doc.text(
      `${Number(data.percentage).toLocaleString()}%`,
      calcValueX,
      doc.y - 14,
      { width: 150, align: "right" }
    );

    doc.moveDown(0.3);
    doc
      .moveTo(calcX, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").fontSize(14);
    doc.text("Payable Amount:", calcX, doc.y, { width: calcWidth - 150, align: "left" });
    doc.text(
      `$${Number(data.payableAmount).toLocaleString()}`,
      calcValueX,
      doc.y - 18,
      { width: 150, align: "right" }
    );

    doc.moveDown(1);

    // Notes
    if (data.notes) {
      doc.fontSize(10).font("Helvetica-Bold").text("Notes:");
      doc.font("Helvetica").fontSize(9).text(data.notes, { lineGap: 2 });
      doc.moveDown(0.5);
    }

    // Payment Terms
    doc.fontSize(10).font("Helvetica-Bold").text("Payment Terms:");
    doc
      .font("Helvetica")
      .fontSize(9)
      .text(
        "Payment is due upon receipt. Please reference the bill number on your payment.",
        { lineGap: 2 }
      );
    doc.moveDown(1);

    // Footer
    doc
      .moveTo(50, doc.page.height - 70)
      .lineTo(545, doc.page.height - 70)
      .stroke();
    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        `Bill ${data.billNumber} | Generated on ${new Date().toLocaleDateString()}`,
        50,
        doc.page.height - 60,
        { align: "center" }
      );

    doc.end();
  });
}
