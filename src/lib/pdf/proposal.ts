import PDFDocument from "pdfkit";

interface ProposalPDFData {
  proposalNumber: string;
  recipientName: string | null;
  recipientAddress: string | null;
  projectName: string | null;
  projectAddress: string | null;
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
  items: Array<{
    service: {
      name: string;
      unit: string;
    };
    quantity: unknown;
    rate: unknown;
    totalAmount: unknown;
  }>;
  additionalCharges: unknown;
  discount: unknown;
  totalAmount: unknown;
  terms: string | null;
  notes: string | null;
  createdAt: Date;
}

export function generateProposalPDF(data: ProposalPDFData): Promise<Buffer> {
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
      .text("PROPOSAL", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Proposal #: ${data.proposalNumber}`, { align: "center" })
      .text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, {
        align: "center",
      })
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
    doc.fontSize(10).font("Helvetica-Bold").text("FROM:", 50, yStart);
    doc.font("Helvetica").text(data.customer.name, 50, yStart + 15);
    if (data.customer.companyName) {
      doc.text(data.customer.companyName, 50, yStart + 30);
    }
    const fromY = data.customer.companyName ? yStart + 45 : yStart + 30;
    if (data.customer.email) {
      doc.text(data.customer.email, 50, fromY);
    }
    if (data.customer.phone) {
      doc.text(data.customer.phone, 50, fromY + 15);
    }

    // To (Recipient info)
    doc.font("Helvetica-Bold").text("TO:", 300, yStart);
    const recipientName = data.recipientName || data.customer.name;
    doc.font("Helvetica").text(recipientName, 300, yStart + 15);
    const recipientAddress = data.recipientAddress || [
      data.customer.address,
      data.customer.city,
      data.customer.state,
      data.customer.zipCode,
    ]
      .filter(Boolean)
      .join(", ");
    if (recipientAddress) {
      doc.text(recipientAddress, 300, yStart + 30);
    }

    doc.y = Math.max(doc.y, yStart + 60);
    doc.moveDown(0.5);

    // Project Info
    if (data.projectName || data.projectAddress) {
      doc.fontSize(10).font("Helvetica-Bold").text("PROJECT:");
      if (data.projectName) {
        doc.font("Helvetica").text(data.projectName);
      }
      if (data.projectAddress) {
        doc.text(data.projectAddress);
      }
      doc.moveDown(0.5);
    }

    // Divider
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(0.5);

    // Items Table Header
    const tableTop = doc.y;
    const colWidths = [200, 80, 100, 115];
    const colX = [50, 250, 330, 430];

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Service", colX[0], tableTop);
    doc.text("Quantity", colX[1], tableTop, { width: colWidths[1], align: "right" });
    doc.text("Rate", colX[2], tableTop, { width: colWidths[2], align: "right" });
    doc.text("Total", colX[3], tableTop, { width: colWidths[3], align: "right" });

    doc.y = tableTop + 15;
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.3);

    // Items
    doc.font("Helvetica").fontSize(9);
    for (const item of data.items) {
      const rowY = doc.y;
      doc.text(item.service.name, colX[0], rowY, { width: colWidths[0] });
      doc.text(Number(item.quantity).toLocaleString(), colX[1], rowY, {
        width: colWidths[1],
        align: "right",
      });
      doc.text(`$${Number(item.rate).toLocaleString()}`, colX[2], rowY, {
        width: colWidths[2],
        align: "right",
      });
      doc.text(`$${Number(item.totalAmount).toLocaleString()}`, colX[3], rowY, {
        width: colWidths[3],
        align: "right",
      });
      doc.y = rowY + 15;
    }

    doc.moveDown(0.3);
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.5);

    // Summary
    const summaryX = 350;
    const summaryWidth = 195;

    doc.fontSize(10).font("Helvetica");
    doc.text("Subtotal:", summaryX, doc.y, {
      width: summaryWidth - 100,
      align: "left",
    });
    const itemsTotal = data.items.reduce(
      (sum, item) => sum + Number(item.totalAmount),
      0
    );
    doc.text(`$${itemsTotal.toLocaleString()}`, summaryX + 100, doc.y - 14, {
      width: 95,
      align: "right",
    });

    if (Number(data.additionalCharges) > 0) {
      doc.text("Additional Charges:", summaryX, doc.y + 2, {
        width: summaryWidth - 100,
        align: "left",
      });
      doc.text(
        `+$${Number(data.additionalCharges).toLocaleString()}`,
        summaryX + 100,
        doc.y - 14,
        { width: 95, align: "right" }
      );
    }

    if (Number(data.discount) > 0) {
      doc.text("Discount:", summaryX, doc.y + 2, {
        width: summaryWidth - 100,
        align: "left",
      });
      doc.text(
        `-$${Number(data.discount).toLocaleString()}`,
        summaryX + 100,
        doc.y - 14,
        { width: 95, align: "right" }
      );
    }

    doc.moveDown(0.3);
    doc
      .moveTo(summaryX, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown(0.3);

    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Total Amount:", summaryX, doc.y, {
      width: summaryWidth - 100,
      align: "left",
    });
    doc.text(
      `$${Number(data.totalAmount).toLocaleString()}`,
      summaryX + 100,
      doc.y - 16,
      { width: 95, align: "right" }
    );

    doc.moveDown(1);

    // Terms
    if (data.terms) {
      doc.fontSize(10).font("Helvetica-Bold").text("Terms & Conditions:");
      doc.font("Helvetica").fontSize(9).text(data.terms, { lineGap: 2 });
      doc.moveDown(0.5);
    }

    // Notes
    if (data.notes) {
      doc.fontSize(10).font("Helvetica-Bold").text("Notes:");
      doc.font("Helvetica").fontSize(9).text(data.notes, { lineGap: 2 });
      doc.moveDown(0.5);
    }

    // Footer
    doc
      .moveTo(50, doc.page.height - 70)
      .lineTo(545, doc.page.height - 70)
      .stroke();
    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        `Proposal ${data.proposalNumber} | Generated on ${new Date().toLocaleDateString()}`,
        50,
        doc.page.height - 60,
        { align: "center" }
      );

    doc.end();
  });
}
