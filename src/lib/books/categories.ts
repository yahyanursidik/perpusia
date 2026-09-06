export const BOOK_CATEGORIES = [
  "aqidah",
  "manhaj",
  "fiqih",
  "hadits",
  "adab-akhlak",
  "tazkiyah",
  "keluarga",
  "pendidikan",
  "ramadhan",
  "haji-umrah",
  "sirah",
  "ulama",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  aqidah: "Aqidah",
  manhaj: "Manhaj",
  fiqih: "Fiqih",
  hadits: "Hadits",
  "adab-akhlak": "Adab & Akhlak",
  tazkiyah: "Tazkiyah",
  keluarga: "Keluarga",
  pendidikan: "Pendidikan",
  ramadhan: "Ramadhan",
  "haji-umrah": "Haji & Umrah",
  sirah: "Sirah",
  ulama: "Ulama",
};

export function getCategoryLabel(category: BookCategory): string {
  return CATEGORY_LABELS[category];
}
