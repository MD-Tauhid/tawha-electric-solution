import PDFDocument from "pdfkit";
import fs from "fs";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface BillPDFData {
  company: {
    name: string; // "Taw-ha Electric Solution"
    tagline: string; // "The Solution of all industrial, ..."
    proprietor: string; // "Proprietor: Mofijur Rahman"
    address: string; // "Mostul,khilkhet,Dhaka | Cell: 01825-297424"
    logo?: Buffer | string | null; // Buffer or file path. Dynamic.
  };
  date: Date | string;
  /** Lines under "To" e.g. ["Managing Director.", "Aartaz Holdings Ltd.", "Shama Complex, ..."] */
  recipient: string[];
  /** Text after "Subject:" – ordinals like 8th are auto-superscripted */
  subject: string;
  /** Centered, bold, underlined heading above the table */
  heading: string;
  /** e.g. "Total area = 2522 sft" (shown with grey highlight). Omit to hide. */
  areaLabel?: string;
  /** Used for the last column header: "Total Bill 20%" */
  percentage: number | string;
  items: {
    description: string;
    quantity: number | string;
    unit: string;
    rate: number | string;
    total: number | string; // "Total Bill"
    payable: number | string; // "Total Bill 20%"
  }[];
  /** Previous dues, e.g. { description: "6th floor due", calculation: "11,541 – 9,000", amount: 2541 } */
  dues?: { description: string; calculation: string; amount: number | string }[];
  payableAmount: number | string;
  /** If omitted it is generated automatically from payableAmount */
  amountInWords?: string;
  /** Lines under "Payment Information:" */
  paymentInfo?: string[];
  closing: {
    regards?: string; // default "Thanks with Best Regards"
    name: string;
    phone?: string;
  };
}

export interface BillPDFOptions {
  /**
   * Path to a .ttf that contains the Taka sign (৳, U+09F3), e.g. NotoSansBengali-Regular.ttf.
   * Built-in PDF fonts do not have it. Without it, "Tk" is printed instead.
   */
  takaFontPath?: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const BLUE = "#0070C0";
const RED = "#C0504D";
const GREY = "#D9D9D9";

const fmtNum = (v: unknown) => Number(v).toLocaleString("en-US");

function fmtDate(d: Date | string) {
  const date = new Date(d);
  const mon = date.toLocaleString("en-US", { month: "short" });
  return `${String(date.getDate()).padStart(2, "0")}-${mon}-${date.getFullYear()}`;
}

/** Taka amount in words, South-Asian system (lakh / crore). */
export function takaInWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const below100 = (n: number) =>
    n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? `-${ones[n % 10]}` : "");
  const below1000 = (n: number) =>
    (n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? " " : ""}` : "") + below100(n % 100);

  let n = Math.round(Math.abs(amount));
  if (n === 0) return "Zero Taka only.";
  const parts: string[] = [];
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  if (crore) parts.push(`${below1000(crore)} Crore`);
  if (lakh) parts.push(`${below100(lakh)} Lakh`);
  if (thousand) parts.push(`${below100(thousand)} Thousand`);
  if (n) parts.push(below1000(n));
  return `${parts.join(" ")} Taka only.`;
}

type Seg = { text: string; sup: boolean };

/** Splits "8th floor" into [{8},{th sup},{ floor}] */
function splitOrdinals(text: string): Seg[] {
  const segs: Seg[] = [];
  const re = /(\d+)(st|nd|rd|th)\b/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) segs.push({ text: text.slice(last, m.index), sup: false });
    segs.push({ text: m[1], sup: false });
    segs.push({ text: m[2], sup: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ text: text.slice(last), sup: false });
  return segs;
}

function richWidth(doc: PDFKit.PDFDocument, text: string, font: string, size: number) {
  return splitOrdinals(text).reduce((w, s) => {
    doc.font(font).fontSize(s.sup ? size * 0.6 : size);
    return w + doc.widthOfString(s.text);
  }, 0);
}

/** Single-line text with auto superscript ordinals, optional underline/centering. */
function drawRich(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  o: { font: string; size: number; color?: string; underline?: boolean; align?: "left" | "center"; width?: number }
) {
  const total = richWidth(doc, text, o.font, o.size);
  let cx = o.align === "center" && o.width ? x + (o.width - total) / 2 : x;
  const startX = cx;
  doc.fillColor(o.color ?? "black");
  for (const s of splitOrdinals(text)) {
    const size = s.sup ? o.size * 0.6 : o.size;
    doc.font(o.font).fontSize(size);
    doc.text(s.text, cx, s.sup ? y - o.size * 0.22 : y, { lineBreak: false });
    cx += doc.widthOfString(s.text);
  }
  if (o.underline) {
    const uy = y + o.size * 1.08;
    doc.save().lineWidth(0.7).strokeColor(o.color ?? "black").moveTo(startX, uy).lineTo(cx, uy).stroke().restore();
  }
  return total;
}

/** Shrinks font until text fits maxWidth, then draws it centered. */
function drawFitCentered(
  doc: PDFKit.PDFDocument,
  text: string,
  y: number,
  x: number,
  maxWidth: number,
  font: string,
  size: number,
  color: string
) {
  let s = size;
  doc.font(font).fontSize(s);
  while (doc.widthOfString(text) > maxWidth && s > 6) {
    s -= 0.5;
    doc.font(font).fontSize(s);
  }
  doc.fillColor(color).text(text, x, y, { width: maxWidth, align: "center", lineBreak: false });
  return s;
}

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */

export function generateBillPDF(data: BillPDFData, options: BillPDFOptions = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true });

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const hasTaka = !!options.takaFontPath && fs.existsSync(options.takaFontPath);
    if (hasTaka) doc.registerFont("Taka", options.takaFontPath!);

    const REG = "Times-Roman";
    const BOLD = "Times-Bold";
    const BOLD_ITALIC = "Times-BoldItalic";

    const PAGE_W = doc.page.width; // 595.28
    const L = 54; // body left edge
    const TABLE_W = 452;

    /* ---------------- Header ---------------- */
    // Logo box spans the full header height (top of name -> bottom of address line)
    const LOGO_BOX = { x: 30, y: 18, w: 108, h: 104 };
    if (data.company.logo) {
      try {
        doc.image(data.company.logo, LOGO_BOX.x, LOGO_BOX.y, {
          fit: [LOGO_BOX.w, LOGO_BOX.h],
          align: "center",
          valign: "center",
        });
      } catch (err) {
        console.error("Bill PDF: failed to render logo", err);
      }
    }

    const hx = LOGO_BOX.x + LOGO_BOX.w + 6;
    const hw = PAGE_W - hx - 20;
    drawFitCentered(doc, data.company.name, 22, hx, hw, "Helvetica-Bold", 24, BLUE);
    drawFitCentered(doc, data.company.tagline, 52, hx, hw, "Helvetica-Bold", 10.5, RED);
    drawFitCentered(doc, data.company.proprietor, 72, hx, hw, "Helvetica-Bold", 13, "black");
    drawFitCentered(doc, data.company.address, 96, hx, hw, "Helvetica-Bold", 13, "black");

    doc.save().lineWidth(2).strokeColor("black").moveTo(25, 130).lineTo(PAGE_W - 25, 130).stroke().restore();

    /* ---------------- Letter block ---------------- */
    let y = 152;
    const BODY = 11;
    const LINE = 13.5;

    doc.font(REG).fontSize(BODY).fillColor("black").text(`Date: ${fmtDate(data.date)}`, L, y, { lineBreak: false });
    y += LINE * 2;

    doc.font(REG).text("To", L, y, { lineBreak: false });
    y += LINE;
    for (const line of data.recipient) {
      doc.font(REG).fontSize(BODY).text(line, L, y, { lineBreak: false });
      y += LINE;
    }

    y += 2;
    doc.font(BOLD).fontSize(BODY).text("Subject:", L, y, { lineBreak: false });
    const subjLabelW = doc.widthOfString("Subject: ");
    drawRich(doc, data.subject, L + subjLabelW, y, { font: BOLD, size: BODY, underline: true });

    /* ---------------- Heading ---------------- */
    y += 52;
    drawRich(doc, data.heading, L, y, { font: BOLD, size: BODY, underline: true, align: "center", width: TABLE_W });

    /* ---------------- Area label (grey highlight) ---------------- */
    y += 26;
    if (data.areaLabel) {
      doc.font(REG).fontSize(12);
      const w = doc.widthOfString(data.areaLabel);
      doc.save().rect(L - 1, y - 2, w + 2, 17).fill(GREY).restore();
      doc.fillColor("black").text(data.areaLabel, L, y, { lineBreak: false });
    }
    y += 22;

    /* ---------------- Table ---------------- */
    const cols = [23, 135, 52, 40, 61, 70, 71];
    const colX = cols.reduce<number[]>((acc, w, i) => {
      acc.push(i === 0 ? L : acc[i - 1] + cols[i - 1]);
      return acc;
    }, []);
    const span = (from: number, to: number) => ({
      x: colX[from],
      w: cols.slice(from, to + 1).reduce((a, b) => a + b, 0),
    });

    const TS = 10; // table font size
    const box = (x: number, top: number, w: number, h: number) =>
      doc.save().lineWidth(0.8).strokeColor("black").rect(x, top, w, h).stroke().restore();

    const textCell = (
      text: string,
      x: number,
      top: number,
      w: number,
      h: number,
      o: { font?: string; size?: number; align?: "left" | "center" | "right" } = {}
    ) => {
      const font = o.font ?? REG;
      const size = o.size ?? TS;
      const align = o.align ?? "center";
      doc.font(font).fontSize(size);
      const hText = doc.heightOfString(text, { width: w - 8 });
      const ty = top + Math.max(2, (h - hText) / 2);
      // single line with ordinals, or wrapped plain text
      if (/(\d+)(st|nd|rd|th)\b/.test(text) && hText <= size * 1.4) {
        drawRich(doc, text, x + 4, top + (h - size * 1.1) / 2, {
          font,
          size,
          align: align === "left" ? "left" : "center",
          width: w - 8,
        });
      } else {
        doc.fillColor("black").text(text, x + 4, ty, { width: w - 8, align, lineGap: 0 });
      }
    };

    const moneyCell = (value: unknown, x: number, top: number, w: number, h: number, bold = false) => {
      const num = fmtNum(value);
      const font = bold ? BOLD : REG;
      doc.font(font).fontSize(TS);
      const ty = top + (h - TS * 1.1) / 2;
      if (hasTaka) {
        const nw = doc.widthOfString(num);
        const gap = 2.5;
        doc.font("Taka").fontSize(TS);
        const sw = doc.widthOfString("৳");
        const sx = x + (w - (nw + gap + sw)) / 2;
        doc.font(font).fontSize(TS).fillColor("black").text(num, sx, ty, { lineBreak: false });
        doc.font("Taka").fontSize(TS).text("৳", sx + nw + gap, ty, { lineBreak: false });
      } else {
        doc.fillColor("black").text(`${num} Tk`, x, ty, { width: w, align: "center", lineBreak: false });
      }
    };

    // Height a cell needs for its (possibly wrapped) text, with vertical padding
    const needH = (text: string, w: number, font = REG) => {
      doc.font(font).fontSize(TS);
      return doc.heightOfString(text, { width: w - 8 }) + 10;
    };

    // Header row (grows if a label wraps)
    const heads = ["SL", "Description of work", "Quantity", "Unit", "Rate in Tk.", "Total Bill", `Total Bill ${data.percentage}%`];
    const headH = Math.max(32, ...heads.map((h, i) => needH(h, cols[i], BOLD)));
    heads.forEach((h, i) => {
      box(colX[i], y, cols[i], headH);
      textCell(h, colX[i], y, cols[i], headH, { font: BOLD });
    });
    y += headH;

    // Item rows (each row expands to fit its longest cell)
    const rowH = 18;
    data.items.forEach((it, idx) => {
      const cells = [String(idx + 1), it.description, fmtNum(it.quantity), it.unit, fmtNum(it.rate)];
      const rh = Math.max(rowH, ...cells.map((c, i) => needH(c, cols[i])));
      cells.forEach((c, i) => {
        box(colX[i], y, cols[i], rh);
        textCell(c, colX[i], y, cols[i], rh, { align: i === 1 ? "left" : "center" });
      });
      box(colX[5], y, cols[5], rh);
      moneyCell(it.total, colX[5], y, cols[5], rh);
      box(colX[6], y, cols[6], rh);
      moneyCell(it.payable, colX[6], y, cols[6], rh);
      y += rh;
    });

    // Due rows (also expand to fit)
    (data.dues ?? []).forEach((due, idx) => {
      const s = span(2, 5);
      const rh = Math.max(rowH, needH(due.description, cols[1]), needH(due.calculation, s.w));
      box(colX[0], y, cols[0], rh);
      if (idx === 0) textCell(String(data.items.length + 1), colX[0], y, cols[0], rh);
      box(colX[1], y, cols[1], rh);
      textCell(due.description, colX[1], y, cols[1], rh, { align: "left" });
      box(s.x, y, s.w, rh);
      textCell(due.calculation, s.x, y, s.w, rh);
      box(colX[6], y, cols[6], rh);
      moneyCell(due.amount, colX[6], y, cols[6], rh);
      y += rh;
    });

    // Payable row
    const payH = 26;
    const left = span(0, 5);
    box(left.x, y, left.w, payH);
    textCell("Payable Bill =", left.x, y, left.w, payH, { font: BOLD });
    box(colX[6], y, cols[6], payH);
    moneyCell(data.payableAmount, colX[6], y, cols[6], payH, true);
    y += payH;

    /* ---------------- In words ---------------- */
    y += 16;
    const words = data.amountInWords ?? takaInWords(Number(data.payableAmount));
    doc.font(BOLD).fontSize(BODY).fillColor("black");
    doc.text(`In Word: ${words}`, L, y, { width: TABLE_W + 40 });
    y = doc.y + 18;

    /* ---------------- Payment info ---------------- */
    if (data.paymentInfo?.length) {
      doc.font(BOLD).fontSize(BODY).text("Payment Information:", L, y, { lineBreak: false });
      y += LINE;
      for (const line of data.paymentInfo) {
        doc.font(REG).fontSize(BODY).text(line, L, y, { lineBreak: false });
        y += LINE;
      }
    }

    /* ---------------- Closing ---------------- */
    y = Math.max(y + 100, 590);
    doc.font(BOLD_ITALIC).fontSize(BODY).text(data.closing.regards ?? "Thanks with Best Regards", L, y, { lineBreak: false });
    y += 34;
    doc.font(BOLD_ITALIC).text(data.closing.name, L, y, { lineBreak: false });
    if (data.closing.phone) {
      y += LINE;
      doc.text(data.closing.phone, L, y, { lineBreak: false });
    }

    doc.end();
  });
}
