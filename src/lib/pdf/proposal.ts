// import PDFDocument from "pdfkit";

// interface ProposalPDFData {
//   proposalNumber: string;
//   recipientName: string | null;
//   recipientAddress: string | null;
//   projectName: string | null;
//   projectAddress: string | null;
//   customer: {
//     name: string;
//     companyName: string | null;
//     email: string | null;
//     phone: string | null;
//     address: string | null;
//     city: string | null;
//     state: string | null;
//     zipCode: string | null;
//   };
//   items: Array<{
//     service: {
//       name: string;
//       unit: string;
//     };
//     quantity: unknown;
//     rate: unknown;
//     totalAmount: unknown;
//   }>;
//   additionalCharges: unknown;
//   discount: unknown;
//   totalAmount: unknown;
//   terms: string | null;
//   notes: string | null;
//   createdAt: Date;
// }

// export function generateProposalPDF(data: ProposalPDFData): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50,
//       bufferPages: true,
//     });

//     const chunks: Buffer[] = [];
//     doc.on("data", (chunk: Buffer) => chunks.push(chunk));
//     doc.on("end", () => resolve(Buffer.concat(chunks)));
//     doc.on("error", reject);

//     // Header
//     doc
//       .fontSize(24)
//       .font("Helvetica-Bold")
//       .text("PROPOSAL", { align: "center" })
//       .moveDown(0.5);

//     doc
//       .fontSize(12)
//       .font("Helvetica")
//       .text(`Proposal #: ${data.proposalNumber}`, { align: "center" })
//       .text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, {
//         align: "center",
//       })
//       .moveDown(1);

//     // Divider
//     doc
//       .moveTo(50, doc.y)
//       .lineTo(545, doc.y)
//       .stroke()
//       .moveDown(0.5);

//     // From/To Section
//     const yStart = doc.y;

//     // From (Customer info)
//     doc.fontSize(10).font("Helvetica-Bold").text("FROM:", 50, yStart);
//     doc.font("Helvetica").text(data.customer.name, 50, yStart + 15);
//     if (data.customer.companyName) {
//       doc.text(data.customer.companyName, 50, yStart + 30);
//     }
//     const fromY = data.customer.companyName ? yStart + 45 : yStart + 30;
//     if (data.customer.email) {
//       doc.text(data.customer.email, 50, fromY);
//     }
//     if (data.customer.phone) {
//       doc.text(data.customer.phone, 50, fromY + 15);
//     }

//     // To (Recipient info)
//     doc.font("Helvetica-Bold").text("TO:", 300, yStart);
//     const recipientName = data.recipientName || data.customer.name;
//     doc.font("Helvetica").text(recipientName, 300, yStart + 15);
//     const recipientAddress = data.recipientAddress || [
//       data.customer.address,
//       data.customer.city,
//       data.customer.state,
//       data.customer.zipCode,
//     ]
//       .filter(Boolean)
//       .join(", ");
//     if (recipientAddress) {
//       doc.text(recipientAddress, 300, yStart + 30);
//     }

//     doc.y = Math.max(doc.y, yStart + 60);
//     doc.moveDown(0.5);

//     // Project Info
//     if (data.projectName || data.projectAddress) {
//       doc.fontSize(10).font("Helvetica-Bold").text("PROJECT:");
//       if (data.projectName) {
//         doc.font("Helvetica").text(data.projectName);
//       }
//       if (data.projectAddress) {
//         doc.text(data.projectAddress);
//       }
//       doc.moveDown(0.5);
//     }

//     // Divider
//     doc
//       .moveTo(50, doc.y)
//       .lineTo(545, doc.y)
//       .stroke()
//       .moveDown(0.5);

//     // Items Table Header
//     const tableTop = doc.y;
//     const colWidths = [200, 80, 100, 115];
//     const colX = [50, 250, 330, 430];

//     doc.fontSize(10).font("Helvetica-Bold");
//     doc.text("Service", colX[0], tableTop);
//     doc.text("Quantity", colX[1], tableTop, { width: colWidths[1], align: "right" });
//     doc.text("Rate", colX[2], tableTop, { width: colWidths[2], align: "right" });
//     doc.text("Total", colX[3], tableTop, { width: colWidths[3], align: "right" });

//     doc.y = tableTop + 15;
//     doc
//       .moveTo(50, doc.y)
//       .lineTo(545, doc.y)
//       .stroke();
//     doc.moveDown(0.3);

//     // Items
//     doc.font("Helvetica").fontSize(9);
//     for (const item of data.items) {
//       const rowY = doc.y;
//       doc.text(item.service.name, colX[0], rowY, { width: colWidths[0] });
//       doc.text(Number(item.quantity).toLocaleString(), colX[1], rowY, {
//         width: colWidths[1],
//         align: "right",
//       });
//       doc.text(`$${Number(item.rate).toLocaleString()}`, colX[2], rowY, {
//         width: colWidths[2],
//         align: "right",
//       });
//       doc.text(`$${Number(item.totalAmount).toLocaleString()}`, colX[3], rowY, {
//         width: colWidths[3],
//         align: "right",
//       });
//       doc.y = rowY + 15;
//     }

//     doc.moveDown(0.3);
//     doc
//       .moveTo(50, doc.y)
//       .lineTo(545, doc.y)
//       .stroke();
//     doc.moveDown(0.5);

//     // Summary
//     const summaryX = 350;
//     const summaryWidth = 195;

//     doc.fontSize(10).font("Helvetica");
//     doc.text("Subtotal:", summaryX, doc.y, {
//       width: summaryWidth - 100,
//       align: "left",
//     });
//     const itemsTotal = data.items.reduce(
//       (sum, item) => sum + Number(item.totalAmount),
//       0
//     );
//     doc.text(`$${itemsTotal.toLocaleString()}`, summaryX + 100, doc.y - 14, {
//       width: 95,
//       align: "right",
//     });

//     if (Number(data.additionalCharges) > 0) {
//       doc.text("Additional Charges:", summaryX, doc.y + 2, {
//         width: summaryWidth - 100,
//         align: "left",
//       });
//       doc.text(
//         `+$${Number(data.additionalCharges).toLocaleString()}`,
//         summaryX + 100,
//         doc.y - 14,
//         { width: 95, align: "right" }
//       );
//     }

//     if (Number(data.discount) > 0) {
//       doc.text("Discount:", summaryX, doc.y + 2, {
//         width: summaryWidth - 100,
//         align: "left",
//       });
//       doc.text(
//         `-$${Number(data.discount).toLocaleString()}`,
//         summaryX + 100,
//         doc.y - 14,
//         { width: 95, align: "right" }
//       );
//     }

//     doc.moveDown(0.3);
//     doc
//       .moveTo(summaryX, doc.y)
//       .lineTo(545, doc.y)
//       .stroke();
//     doc.moveDown(0.3);

//     doc.fontSize(12).font("Helvetica-Bold");
//     doc.text("Total Amount:", summaryX, doc.y, {
//       width: summaryWidth - 100,
//       align: "left",
//     });
//     doc.text(
//       `$${Number(data.totalAmount).toLocaleString()}`,
//       summaryX + 100,
//       doc.y - 16,
//       { width: 95, align: "right" }
//     );

//     doc.moveDown(1);

//     // Terms
//     if (data.terms) {
//       doc.fontSize(10).font("Helvetica-Bold").text("Terms & Conditions:");
//       doc.font("Helvetica").fontSize(9).text(data.terms, { lineGap: 2 });
//       doc.moveDown(0.5);
//     }

//     // Notes
//     if (data.notes) {
//       doc.fontSize(10).font("Helvetica-Bold").text("Notes:");
//       doc.font("Helvetica").fontSize(9).text(data.notes, { lineGap: 2 });
//       doc.moveDown(0.5);
//     }

//     // Footer
//     doc
//       .moveTo(50, doc.page.height - 70)
//       .lineTo(545, doc.page.height - 70)
//       .stroke();
//     doc
//       .fontSize(8)
//       .font("Helvetica")
//       .text(
//         `Proposal ${data.proposalNumber} | Generated on ${new Date().toLocaleDateString()}`,
//         50,
//         doc.page.height - 60,
//         { align: "center" }
//       );

//     doc.end();
//   });
// }


import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

export interface ProposalPDFData {
  /** Letterhead – repeated on every page */
  company: {
    name: string; // "Taw-ha Electric Solution"
    tagline?: string; // "The Solution of all industrial, household ..."
    proprietor?: string; // "Mofijur Rahman"
    address?: string; // "Mostul,khilkhet,Dhaka"
    phone?: string; // "01825-297424"
    logoPath?: string; // absolute path to a PNG/JPG
  };

  /** Letter header */
  date: Date;
  recipient: {
    salutation?: string; // default "বরাবর,"
    name: string; // "Home street builders Ltd,"
    address?: string; // "ঢাকা -১২০৫।"
  };
  subject: string; // "সেক্টর-১৩, রোড-৪০৩, প্লট-০৩ ... কোটেশন।"

  /** 1. Scope of work */
  scope: {
    heading?: string; // "বিভিন্ন ধরনের পয়েন্টসমূহঃ"
    items: string[]; // ক) ... খ) ... গ) ...  (labels auto-generated)
    note?: string; // বি.দ্রঃ text
  };

  /** Rate statement. Either pass `statement` or let it be built from amount. */
  rate: {
    amount: number; // 23
    statement?: string; // full custom sentence (overrides the auto one)
    prefix?: string; // default "সম্পূর্ণ কাজ করার জন্য ছাদ মাপে প্রতি বর্গফুট দর"
  };

  /** 2. Payment terms */
  paymentTerms: string[];

  /** 3. Other conditions */
  conditions: string[];

  /** Closing / signature */
  signatory: {
    name: string; // "মফিজুর রহমান"
    company: string; // "ত্ব-হা ইলেকট্রিক সলিউশন"
    mobile?: string; // "০১৮২৫-২৯৭৪২৪"
  };

  /** Optional "honoured clients" page */
  clients?: {
    title?: string; // "সম্মানিত গ্রাহকগণ (জলসিঁড়ি আবাসন):"
    list: Array<{
      name: string;
      projects?: Array<{ name: string; address?: string }>;
      contact?: string;
    }>;
  };

  /** Override any fixed label (all default to Bangla) */
  labels?: Partial<Labels>;
}

interface Labels {
  date: string;
  salutation: string;
  subjectPrefix: string;
  quotation: string;
  scopeTitle: string;
  paymentTitle: string;
  conditionsTitle: string;
  noteLabel: string;
  thanks: string;
  contact: string;
  mobile: string;
}

const DEFAULT_LABELS: Labels = {
  date: "তারিখ",
  salutation: "বরাবর,",
  subjectPrefix: "বিষয়ঃ",
  quotation: "কোটেশন",
  scopeTitle: "কাজের বিবরণ",
  paymentTitle: "বিল প্রদানের পদ্ধতি:",
  conditionsTitle: "কার্য সম্পাদনের অন্যান্য শর্তাবলী:",
  noteLabel: "বি.দ্রঃ",
  thanks: "ধন্যবাদান্তে",
  contact: "যোগাযোগ",
  mobile: "মোবাইলঃ",
};

/* -------------------------------------------------------------------------- */
/*  Bangla helpers                                                             */
/* -------------------------------------------------------------------------- */

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const BN_LETTERS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ"];
const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

export const toBn = (v: string | number) =>
  String(v).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

const formatBnDate = (d: Date) =>
  `${toBn(String(d.getDate()).padStart(2, "0"))} ${BN_MONTHS[d.getMonth()]} ${toBn(
    d.getFullYear()
  )}`;

/* -------------------------------------------------------------------------- */
/*  Fonts                                                                      */
/*  Download "Hind Siliguri" (Regular + Bold) from Google Fonts and put the    */
/*  .ttf files in /public/fonts. It has both Bangla and Latin glyphs, so       */
/*  mixed text like "Home street builders Ltd" renders correctly.              */
/* -------------------------------------------------------------------------- */

const FONT_DIR = path.join(process.cwd(), "public", "fonts");
const FONT_REGULAR = path.join(FONT_DIR, "HindSiliguri-Regular.ttf");
const FONT_BOLD = path.join(FONT_DIR, "HindSiliguri-Bold.ttf");

const BLUE = "#0B6EC1";
const RED = "#C0504D";
const BLACK = "#000000";

/* -------------------------------------------------------------------------- */
/*  Generator                                                                  */
/* -------------------------------------------------------------------------- */

export function generateProposalPDF(data: ProposalPDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const L: Labels = { ...DEFAULT_LABELS, ...data.labels };
    const c = data.company;

    const doc = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.registerFont("Bn", FONT_REGULAR);
    doc.registerFont("BnB", FONT_BOLD);

    const left = 50;
    const contentW = doc.page.width - 100;
    const bodyTop = 140;

    /* ------------------------------ letterhead ----------------------------- */
    const drawLetterhead = () => {
      const right = doc.page.width - 50;

      if (c.logoPath && fs.existsSync(c.logoPath)) {
        doc.image(c.logoPath, left, 36, { fit: [75, 75] });
      }

      const x = left + 85;
      const w = right - x;

      doc.fillColor(BLUE).font("Helvetica-Bold").fontSize(28);
      doc.text(c.name, x, 34, { width: w, align: "center", lineBreak: false });

      if (c.tagline) {
        doc.fillColor(RED).font("Helvetica-Bold").fontSize(9.5);
        doc.text(c.tagline, x, 68, { width: w, align: "center", lineBreak: false });
      }

      doc.fillColor(BLACK).font("Helvetica-Bold");
      if (c.proprietor) {
        doc.fontSize(13).text(`Proprietor: ${c.proprietor}`, x, 83, {
          width: w, align: "center", lineBreak: false,
        });
      }
      const contactLine = [c.address, c.phone && `Cell: ${c.phone}`]
        .filter(Boolean)
        .join(" | ");
      if (contactLine) {
        doc.fontSize(13).text(contactLine, x, 101, {
          width: w, align: "center", lineBreak: false,
        });
      }

      doc.lineWidth(1.5).moveTo(left, 124).lineTo(right, 124).stroke(BLACK);
      doc.lineWidth(1);

      doc.fillColor(BLACK);
      doc.x = left;
      doc.y = bodyTop;
    };

    drawLetterhead();
    doc.on("pageAdded", drawLetterhead);

    /* -------------------------------- helpers ------------------------------ */
    const bottomLimit = () => doc.page.height - doc.page.margins.bottom;
    const ensureSpace = (h: number) => {
      if (doc.y + h > bottomLimit()) doc.addPage();
    };

    const para = (
      text: string,
      opts: { bold?: boolean; size?: number; align?: "left" | "center" | "right" | "justify"; gap?: number } = {}
    ) => {
      doc.font(opts.bold ? "BnB" : "Bn").fontSize(opts.size ?? 11);
      const h = doc.heightOfString(text, { width: contentW, align: opts.align });
      ensureSpace(h + 4);
      doc.text(text, left, doc.y, { width: contentW, align: opts.align ?? "left" });
      doc.moveDown(opts.gap ?? 0.6);
    };

    const sectionTitle = (text: string, underline = false) => {
      doc.font("BnB").fontSize(13);
      ensureSpace(doc.heightOfString(text, { width: contentW }) + 20);
      doc.text(text, left, doc.y, { width: contentW, underline });
      doc.moveDown(0.6);
    };

    /** Hanging-indent list row: label on the left, wrapped text on the right */
    const listItem = (
      label: string,
      text: string,
      opts: { indent?: number; textIndent?: number; size?: number } = {}
    ) => {
      const indent = opts.indent ?? 22;
      const textIndent = opts.textIndent ?? 50;
      const size = opts.size ?? 11;
      const textW = contentW - textIndent;

      doc.font("Bn").fontSize(size);
      const h = doc.heightOfString(text, { width: textW, align: "justify" });
      ensureSpace(h + 8);

      const y = doc.y;
      doc.font("BnB").text(label, left + indent, y, { width: textIndent - indent });
      doc.font("Bn").text(text, left + textIndent, y, { width: textW, align: "justify" });
      doc.y = y + h + 6;
    };

    /* ------------------------------ page 1 body ---------------------------- */
    // Date
    para(`${L.date}: ${formatBnDate(data.date)}`, { size: 10.5, gap: 0.8 });

    // Recipient
    para(data.recipient.salutation ?? L.salutation, { size: 11, gap: 0.3 });
    para(data.recipient.name, { size: 11, gap: 0.2 });
    if (data.recipient.address) para(data.recipient.address, { size: 11, gap: 0.8 });

    // Subject
    para(`${L.subjectPrefix} ${data.subject}`, { bold: true, size: 11.5, gap: 1.2 });

    // Title
    doc.font("BnB").fontSize(17);
    doc.text(L.quotation, left, doc.y, { width: contentW, align: "center", underline: true });
    doc.moveDown(1);

    // 1. Scope
    sectionTitle(`${toBn(1)}. ${L.scopeTitle}`);
    if (data.scope.heading) {
      doc.font("BnB").fontSize(12.5);
      doc.text(data.scope.heading, left + 18, doc.y, { width: contentW - 18 });
      doc.moveDown(0.5);
    }
    data.scope.items.forEach((item, i) => {
      listItem(`${BN_LETTERS[i] ?? toBn(i + 1)})`, item, { indent: 18, textIndent: 46 });
    });

    if (data.scope.note) {
      doc.moveDown(0.3);
      doc.font("BnB").fontSize(11);
      const noteH = doc.heightOfString(`${L.noteLabel} ${data.scope.note}`, { width: contentW });
      ensureSpace(noteH + 6);
      doc.text(`${L.noteLabel} `, left, doc.y, { continued: true, width: contentW });
      doc.font("Bn").text(data.scope.note, { width: contentW });
      doc.moveDown(0.6);
    }

    // Rate statement
    const rateText =
      data.rate.statement ??
      `${data.rate.prefix ?? "সম্পূর্ণ কাজ করার জন্য ছাদ মাপে প্রতি বর্গফুট দর"} = ${toBn(
        data.rate.amount.toFixed(2)
      )}/= টাকা মাত্র।`;
    para(rateText, { bold: true, size: 11, gap: 1 });

    /* ------------------------------ 2. payment ----------------------------- */
    if (data.paymentTerms.length) {
      sectionTitle(`${toBn(2)}. ${L.paymentTitle}`, false);
      data.paymentTerms.forEach((t, i) =>
        listItem(`${BN_LETTERS[i] ?? toBn(i + 1)})`, t, { indent: 22, textIndent: 48, size: 10.5 })
      );
      doc.moveDown(0.4);
    }

    /* ----------------------------- 3. conditions --------------------------- */
    if (data.conditions.length) {
      sectionTitle(`${toBn(3)}. ${L.conditionsTitle}`);
      data.conditions.forEach((t, i) =>
        listItem(`${BN_LETTERS[i] ?? toBn(i + 1)}.`, t, { indent: 8, textIndent: 36, size: 10.5 })
      );
      doc.moveDown(0.8);
    }

    /* ------------------------------- signature ----------------------------- */
    ensureSpace(100);
    doc.moveDown(1.5);
    para(L.thanks, { size: 11, gap: 1.8 });
    para(data.signatory.name, { size: 11, gap: 0.1 });
    para(data.signatory.company, { bold: true, size: 11, gap: 0.1 });
    if (data.signatory.mobile) {
      para(`${L.mobile} ${data.signatory.mobile}`, { size: 11, gap: 0 });
    }

    /* ------------------------------ clients page --------------------------- */
    if (data.clients?.list.length) {
      const PER_PAGE = 12; // 6 per column
      const colW = contentW / 2;
      const pad = 10;

      const renderClient = (
        cl: NonNullable<ProposalPDFData["clients"]>["list"][number],
        n: number,
        x: number,
        startY: number
      ): number => {
        let y = startY;
        const w = colW - pad * 2;

        doc.font("BnB").fontSize(11);
        doc.text(`${toBn(n)}। ${cl.name}`, x + pad, y, { width: w });
        y = doc.y + 3;

        const projects = cl.projects ?? [];
        projects.forEach((p, pi) => {
          doc.font("Bn").fontSize(10);
          const title = projects.length > 1 ? `${toBn(pi + 1)}। ${p.name}` : p.name;
          doc.text(title, x + pad + 10, y, { width: w - 10 });
          y = doc.y + 1;
          if (p.address) {
            doc.text(p.address, x + pad + 22, y, { width: w - 22 });
            y = doc.y + 2;
          }
        });

        if (cl.contact) {
          doc.font("Bn").fontSize(10).text(`${L.contact} - `, x + pad + 10, y, {
            width: w - 10,
            continued: true,
          });
          doc.font("BnB").text(cl.contact);
          y = doc.y + 2;
        }
        return y + 8;
      };

      for (let start = 0; start < data.clients.list.length; start += PER_PAGE) {
        doc.addPage();
        if (start === 0 && data.clients.title) {
          doc.font("BnB").fontSize(13).text(data.clients.title, left, bodyTop + 10, {
            width: contentW,
          });
          doc.moveDown(1);
        }

        const chunk = data.clients.list.slice(start, start + PER_PAGE);
        const half = Math.ceil(chunk.length / 2);
        const boxTop = doc.y;

        let yL = boxTop + 8;
        chunk.slice(0, half).forEach((cl, i) => {
          yL = renderClient(cl, start + i + 1, left, yL);
        });

        let yR = boxTop + 8;
        chunk.slice(half).forEach((cl, i) => {
          yR = renderClient(cl, start + half + i + 1, left + colW, yR);
        });

        const boxBottom = Math.max(yL, yR);
        doc.rect(left, boxTop, contentW, boxBottom - boxTop).stroke(BLACK);
        doc.moveTo(left + colW, boxTop).lineTo(left + colW, boxBottom).stroke(BLACK);
      }
    }

    doc.end();
  });
}