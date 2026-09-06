import { getCollection, type CollectionEntry } from "astro:content";

import type { BookCategory } from "./categories";
import { getAdminBooks } from "./content-file";

export type BookEntry = Pick<CollectionEntry<"books">, "data">;

export async function getVisibleBooks(): Promise<BookEntry[]> {
  const books = await getAdminBooks(await getCollection("books"));

  return books
    .filter(({ data }) => data.publication.status === "published" || data.mock || data.preview)
    .toSorted((a, b) => a.data.title.localeCompare(b.data.title, "id"));
}

export function getBooksByCategory(books: BookEntry[], category: BookCategory): BookEntry[] {
  return books.filter(({ data }) => data.categories.includes(category));
}

export function getUsedCategories(books: BookEntry[]): BookCategory[] {
  return [...new Set(books.flatMap(({ data }) => data.categories))].toSorted();
}

export function getReadingTimeLabel(minutes: number): string {
  return minutes > 0 ? `± ${minutes} menit` : "Estimasi belum tersedia";
}
