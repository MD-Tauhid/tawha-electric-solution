import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import {
  BN_LETTERS,
  BN_MONTHS,
  DEFAULT_CLIENTS,
  DEFAULT_COMPANY,
  DEFAULT_CONDITIONS,
  DEFAULT_SCOPE,
  DEFAULT_SIGNATORY,
  buildPaymentTerms,
  toBn,
  type ProposalClient,
  type ProposalClientsSection,
  type ProposalScope,
} from "./proposal-defaults";

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

export interface ProposalPDFData {
  /** Letterhead (repeated on every page). Everything falls back to DEFAULT_COMPANY. */
  company?: {
    name?: string;
    tagline?: string;
    proprietor?: string;
    address?: string;
    phone?: string;
    logo?: Buffer | string | null; // Buffer or file path
  };

  date: Date | string;

  /** Customer block under "বরাবর," – one entry per line */
  recipient: {
    salutation?: string; // default "বরাবর,"
    lines: string[]; // ["ম্যানেজিং ডিরেক্টর", "Homes 71 ltd.", "Mirpur, 1216."]
  };

  /** Text after "বিষয়ঃ" */
  subject: string;

  /** Rate per sq ft – the dynamic part */
  rate: {
    amount: number; // 25  -> "২৫.০০/= টাকা মাত্র।"
    /** Optional full custom sentence (overrides the generated one) */
    statement?: string;
  };

  /** All optional – defaults live in proposal-defaults.ts */
  scope?: ProposalScope;
  paymentTerms?: string[]; // or buildPaymentTerms([20, 35, 25, 20])
  conditions?: string[];
  signatory?: { name?: string; company?: string; mobile?: string };
  /** undefined -> default clients page, null -> no clients page */
  clients?: ProposalClientsSection | null;
  /** Start "২. বিল প্রদানের পদ্ধতি" on a new page like the original (default true) */
  breakBeforePayment?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Fonts – Hind Siliguri (Bangla + Latin) in /public/fonts                    */
/* -------------------------------------------------------------------------- */

const FONT_DIR = path.join(process.cwd(), "public", "fonts");
const FONT_REGULAR = path.join(FONT_DIR, "HindSiliguri-Regular.ttf");
const FONT_BOLD = path.join(FONT_DIR, "HindSiliguri-Bold.ttf");

const BLUE = "#0070C0";
const RED = "#C0504D";
const BLACK = "#000000";

const formatBnDate = (input: Date | string) => {
  const d = new Date(input);
  return `${toBn(String(d.getDate()).padStart(2, "0"))} ${BN_MONTHS[d.getMonth()]} ${toBn(d.getFullYear())}`;
};

/* -------------------------------------------------------------------------- */
/*  Generator                                                                  */
/* -------------------------------------------------------------------------- */

export function generateProposalPDF(data: ProposalPDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(FONT_REGULAR) || !fs.existsSync(FONT_BOLD)) {
      return reject(
        new Error(
          `Bangla fonts not found. Put HindSiliguri-Regular.ttf and HindSiliguri-Bold.ttf in ${FONT_DIR}`,
        ),
      );
    }

    const company = { ...DEFAULT_COMPANY, ...data.company };
    const scope = data.scope ?? DEFAULT_SCOPE;
    const paymentTerms = data.paymentTerms ?? buildPaymentTerms();
    const conditions = data.conditions ?? DEFAULT_CONDITIONS;
    const signatory = { ...DEFAULT_SIGNATORY, ...data.signatory };
    const clients = data.clients === undefined ? DEFAULT_CLIENTS : data.clients;

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.registerFont("Bn", FONT_REGULAR);
    doc.registerFont("BnB", FONT_BOLD);

    const PAGE_W = doc.page.width;
    const left = 54;
    const right = 545;
    const contentW = right - left;
    const FIRST_PAGE_TOP = 168;
    const NEXT_PAGE_TOP = 146;

    /* ------------------------------ letterhead ----------------------------- */
    const fitCentered = (
      text: string,
      y: number,
      x: number,
      maxW: number,
      size: number,
      color: string,
    ) => {
      let s = size;
      doc.font("Helvetica-Bold").fontSize(s);
      while (doc.widthOfString(text) > maxW && s > 6) {
        s -= 0.5;
        doc.fontSize(s);
      }
      doc.fillColor(color).text(text, x, y, { width: maxW, align: "center", lineBreak: false });
    };

    const LOGO_BOX = { x: 30, y: 18, w: 108, h: 104 };

    const drawLetterhead = () => {
      if (company.logo) {
        try {
          doc.image(company.logo, LOGO_BOX.x, LOGO_BOX.y, {
            fit: [LOGO_BOX.w, LOGO_BOX.h],
            align: "center",
            valign: "center",
          });
        } catch (err) {
          console.error("Proposal PDF: failed to render logo", err);
        }
      }

      const hx = LOGO_BOX.x + LOGO_BOX.w + 6;
      const hw = PAGE_W - hx - 20;

      fitCentered(company.name, 22, hx, hw, 24, BLUE);
      if (company.tagline) fitCentered(company.tagline, 52, hx, hw, 10.5, RED);
      if (company.proprietor) fitCentered(`Proprietor: ${company.proprietor}`, 72, hx, hw, 13, BLACK);
      const contactLine = [company.address, company.phone && `Cell: ${company.phone}`]
        .filter(Boolean)
        .join(" | ");
      if (contactLine) fitCentered(contactLine, 96, hx, hw, 13, BLACK);

      doc.save().lineWidth(2).strokeColor(BLACK).moveTo(25, 130).lineTo(PAGE_W - 25, 130).stroke().restore();
      doc.fillColor(BLACK);
    };

    drawLetterhead();
    doc.y = FIRST_PAGE_TOP;
    doc.on("pageAdded", () => {
      drawLetterhead();
      doc.y = NEXT_PAGE_TOP;
    });

    /* -------------------------------- helpers ------------------------------ */
    const bottomLimit = () => doc.page.height - doc.page.margins.bottom;
    const ensureSpace = (h: number) => {
      if (doc.y + h > bottomLimit()) doc.addPage();
    };

    const para = (
      text: string,
      o: { bold?: boolean; size?: number; x?: number; gap?: number; align?: "left" | "center" | "justify" } = {},
    ) => {
      const x = o.x ?? left;
      const w = right - x;
      doc.font(o.bold ? "BnB" : "Bn").fontSize(o.size ?? 11).fillColor(BLACK);
      const h = doc.heightOfString(text, { width: w, align: o.align });
      ensureSpace(h + 4);
      doc.text(text, x, doc.y, { width: w, align: o.align ?? "left" });
      doc.y += o.gap ?? 4;
    };

    const sectionTitle = (num: string, title: string, underline = false) => {
      doc.font("BnB").fontSize(13);
      ensureSpace(doc.heightOfString(`${num} ${title}`, { width: contentW }) + 30);
      doc.fillColor(BLACK).text(`${num} `, left, doc.y, { width: contentW, continued: true });
      doc.text(title, { underline });
      doc.y += 6;
    };

    /** Hanging-indent row: bold label on the left, justified wrapped text on the right */
    const listItem = (
      label: string,
      text: string,
      o: { indent: number; textIndent: number; size: number; lineGap: number; gap: number },
    ) => {
      const textW = right - (left + o.textIndent);
      doc.font("Bn").fontSize(o.size);
      const h = doc.heightOfString(text, { width: textW, align: "justify", lineGap: o.lineGap });
      ensureSpace(h + 6);
      const y = doc.y;
      doc.font("BnB").fillColor(BLACK).text(label, left + o.indent, y, { width: o.textIndent - o.indent });
      doc.font("Bn").text(text, left + o.textIndent, y, { width: textW, align: "justify", lineGap: o.lineGap });
      doc.y = y + h + o.gap;
    };

    /* ================================ PAGE 1 ================================ */
    para(`তারিখ: ${formatBnDate(data.date)}`, { size: 10.5, gap: 10 });

    para(data.recipient.salutation ?? "বরাবর,", { size: 11, gap: 1 });
    data.recipient.lines.forEach((line, i) => {
      para(line, { size: 11, gap: i === data.recipient.lines.length - 1 ? 3 : 1 });
    });

    para(`বিষয়ঃ ${data.subject}`, { bold: true, size: 11.5, gap: 22 });

    // Title
    doc.font("BnB").fontSize(17).fillColor(BLACK);
    doc.text("কোটেশন", left, doc.y, { width: contentW, align: "center", underline: true });
    doc.y += 12;

    // 1. Scope
    sectionTitle(`${toBn(1)}.`, "কাজের বিবরণ");
    if (scope.heading) {
      para(scope.heading, { bold: true, size: 12.5, x: left + 17, gap: 8 });
    }
    scope.items.forEach((item, i) => {
      listItem(`${BN_LETTERS[i] ?? toBn(i + 1)})`, item, {
        indent: 17,
        textIndent: 38,
        size: 12,
        lineGap: 3,
        gap: 8,
      });
    });

    if (scope.note) {
      doc.y += 2;
      doc.font("BnB").fontSize(11.5);
      const full = `বি.দ্রঃ ${scope.note}`;
      ensureSpace(doc.heightOfString(full, { width: right - (left + 17) }) + 6);
      doc.text("বি.দ্রঃ ", left + 17, doc.y, { width: right - (left + 17), continued: true });
      doc.font("Bn").text(scope.note);
      doc.y += 8;
    }

    // Rate statement (dynamic)
    const rateText =
      data.rate.statement ??
      `সম্পূর্ণ কাজ করার জন্য ছাদ মাপে প্রতি বর্গফুট দর = ${toBn(data.rate.amount.toFixed(2))}/= টাকা মাত্র।`;
    para(rateText, { bold: true, size: 12, x: left + 18, gap: 8 });

    /* ================================ PAGE 2 ================================ */
    if (paymentTerms.length || conditions.length) {
      if (data.breakBeforePayment ?? true) doc.addPage();
    }

    const smallList = { indent: 17, textIndent: 37, size: 10.5, lineGap: 2, gap: 9 };

    if (paymentTerms.length) {
      sectionTitle(`${toBn(2)}.`, "বিল প্রদানের পদ্ধতিঃ", true);
      paymentTerms.forEach((t, i) => listItem(`${BN_LETTERS[i] ?? toBn(i + 1)})`, t, smallList));
      doc.y += 12;
    }

    if (conditions.length) {
      sectionTitle(`${toBn(3)}.`, "কার্য সম্পাদনের অন্যান্য শর্তাবলীঃ");
      conditions.forEach((t, i) => listItem(`${BN_LETTERS[i] ?? toBn(i + 1)}.`, t, smallList));
    }

    // Signature
    ensureSpace(120);
    doc.y += 60;
    para("ধন্যবাদান্তে", { size: 11, gap: 22 });
    para(signatory.name, { size: 11, gap: 0 });
    para(signatory.company, { bold: true, size: 11, gap: 0 });
    if (signatory.mobile) para(`মোবাইলঃ ${signatory.mobile}`, { size: 11, gap: 0 });

    /* ============================ CLIENTS PAGE(S) ============================ */
    if (clients?.list.length) {
      const PER_PAGE = 12;
      const colW = contentW / 2;
      const pad = 19;
      const textW = colW - pad * 2;

      /** Lays out one client; with draw=false it only measures. Returns the new y. */
      const layoutClient = (cl: ProposalClient, n: number, x: number, startY: number, draw: boolean) => {
        let y = startY;

        const put = (text: string, dx: number, font: "Bn" | "BnB", size: number, gap: number) => {
          const w = textW - dx;
          doc.font(font).fontSize(size).fillColor(BLACK);
          const h = doc.heightOfString(text, { width: w });
          if (draw) doc.text(text, x + pad + dx, y, { width: w });
          y += h + gap;
        };

        put(`${toBn(n)}। ${cl.name}`, 0, "BnB", 11, 3);

        const projects = cl.projects ?? [];
        projects.forEach((p, pi) => {
          if (p.name) {
            put(projects.length > 1 ? `${toBn(pi + 1)}। ${p.name}` : p.name, 15, "Bn", 10, 1);
          }
          if (p.address) put(p.address, p.name ? 25 : 15, "Bn", 10, 2);
        });

        if (cl.contact) {
          const label = "যোগাযোগ - ";
          doc.font("Bn").fontSize(10);
          const h = doc.heightOfString(label, { width: textW - 6 });
          if (draw) {
            doc.font("Bn").fontSize(10).fillColor(BLACK);
            doc.text(label, x + pad + 6, y, { width: textW - 6, continued: true });
            doc.font("BnB").text(cl.contact);
          }
          y += h + 2;
        }
        return y + 8;
      };

      for (let start = 0; start < clients.list.length; start += PER_PAGE) {
        doc.addPage();
        const chunk = clients.list.slice(start, start + PER_PAGE);

        if (start === 0 && clients.title) {
          doc.font("BnB").fontSize(13).fillColor(BLACK);
          doc.text(clients.title, left, doc.y, { width: contentW });
          doc.y += 14;
        }
        const top = doc.y + 8;

        // Pick the split point that gives the most balanced columns
        const heights = chunk.map((cl, i) => layoutClient(cl, start + i + 1, left, 0, false));
        let split = Math.ceil(chunk.length / 2);
        let best = Infinity;
        for (let k = 1; k < chunk.length; k++) {
          const l = heights.slice(0, k).reduce((a, b) => a + b, 0);
          const r = heights.slice(k).reduce((a, b) => a + b, 0);
          if (Math.max(l, r) < best) {
            best = Math.max(l, r);
            split = k;
          }
        }
        if (chunk.length === 1) split = 1;

        let yL = top;
        chunk.slice(0, split).forEach((cl, i) => {
          yL = layoutClient(cl, start + i + 1, left, yL, true);
        });
        let yR = top;
        chunk.slice(split).forEach((cl, i) => {
          yR = layoutClient(cl, start + split + i + 1, left + colW, yR, true);
        });
      }
    }

    doc.end();
  });
}