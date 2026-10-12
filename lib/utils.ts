export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(input: number | string): string {
  return String(input).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = toArabicDigits(d.getDate());
  const month = toArabicDigits(d.getMonth() + 1);
  const year = toArabicDigits(d.getFullYear());
  return `${day}/${month}/${year}`;
}
