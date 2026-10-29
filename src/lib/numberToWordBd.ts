
const ONES: string[] = [
  "Zero", "One", "Two", "Three", "Four",
  "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen",
  "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS: string[] = [
  "", "", "Twenty", "Thirty", "Forty",
  "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

const SCALES: string[] = [
  "", "Thousand", "Lakh", "Crore", "Arab", "Kharab",
];

function convertBelowThousand(num: number): string {
  const words: string[] = [];

  if (num >= 100) {
    words.push(ONES[Math.floor(num / 100)], "Hundred");
    num %= 100;
  }

  if (num >= 20) {
    words.push(TENS[Math.floor(num / 10)]);
    num %= 10;
  }

  if (num > 0) {
    words.push(ONES[num]);
  }

  return words.join(" ");
}

export function numberToWordsBD(num: number): string {
  if (!Number.isSafeInteger(num) || num < 0) {
    throw new Error(
      "Please provide a valid non-negative integer."
    );
  }

  if (num === 0) {
    return "Zero";
  }

  const groups: number[] = [];

  // The first group contains 3 digits.
  groups.push(num % 1000);
  num = Math.floor(num / 1000);

  // Remaining groups contain 2 digits each.
  while (num > 0) {
    groups.push(num % 100);
    num = Math.floor(num / 100);
  }

  const result: string[] = [];

  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];

    if (group > 0) {
      const words = convertBelowThousand(group);
      const scale = SCALES[i];

      result.push(
        scale ? `${words} ${scale}` : words
      );
    }
  }

  return result.join(" ");
}

export function amountInWordsBD(amount: number): string {
  return `${numberToWordsBD(amount)} Taka Only`;
}
