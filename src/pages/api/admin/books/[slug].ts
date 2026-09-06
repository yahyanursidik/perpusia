import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { BOOK_CATEGORIES } from "../../../../lib/books/categories";
import { deleteBookContent, getAdminBooks, removeAdminBook, upsertAdminBook, writeBookContent } from "../../../../lib/books/content-file";
import { listDraftBooks } from "../../../../lib/books/drafts";

export const prerender = false;

const verificationStatuses = new Set([
  "discovered",
  "imported",
  "extracting",
  "converted",
  "needs-review",
  "verified",
  "published",
  "archived",
]);
const publicationStatuses = verificationStatuses;

export const PATCH: APIRoute = async ({ params, request }) => {
  const denied = guardLocalRequest(request);
  if (denied) return denied;

  const slug = params.slug ?? "";
  const books = await getAdminBooks(await getCollection("books"), await listDraftBooks());
  const book = books.find(({ data }) => data.slug === slug);
  if (!book) return json({ error: "Buku tidak ditemukan." }, 404);

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Data formulir tidak valid." }, 400);
  }

  const title = text(payload.title, 160);
  const authors = textList(payload.authors, 8);
  const translators = textList(payload.translators, 8);
  const reviewers = textList(payload.reviewers, 8);
  const categories = textList(payload.categories, 4);
  const tags = textList(payload.tags, 16);
  const languages = textList(payload.languages, 4);
  const description = text(payload.description, 3000);
  const publisher = text(payload.publisher, 180);
  const editionLabel = text(payload.editionLabel, 120, true);
  const editionYear = text(payload.editionYear, 20, true);
  const verificationNotes = text(payload.verificationNotes, 3000, true);
  const sourcePageUrl = optionalUrl(payload.sourcePageUrl);
  const originalPdfUrl = optionalUrl(payload.originalPdfUrl);
  const verificationStatus = text(payload.verificationStatus, 40);
  const publicationStatus = text(payload.publicationStatus, 40);

  if (!title || !authors.length || !categories.length || !languages.length || !description || !publisher) {
    return json({ error: "Judul, penulis, kategori, bahasa, deskripsi, dan penerbit wajib diisi." }, 400);
  }
  if (categories.some((category) => !BOOK_CATEGORIES.includes(category as (typeof BOOK_CATEGORIES)[number]))) {
    return json({ error: "Kategori buku tidak dikenali." }, 400);
  }
  if (!verificationStatuses.has(verificationStatus) || !publicationStatuses.has(publicationStatus)) {
    return json({ error: "Status editorial atau publikasi tidak valid." }, 400);
  }
  if (sourcePageUrl === null || originalPdfUrl === null) return json({ error: "URL sumber atau PDF asli tidak valid." }, 400);

  const next = {
    ...book.data,
    title,
    authors,
    contributors: { translators, reviewers },
    categories: categories as (typeof BOOK_CATEGORIES)[number][],
    tags,
    language: languages,
    description,
    source: {
      ...book.data.source,
      publisher,
      pageUrl: sourcePageUrl || undefined,
      originalPdfUrl: originalPdfUrl || undefined,
    },
    edition: { label: editionLabel, year: editionYear },
    verification: {
      ...book.data.verification,
      status: verificationStatus as typeof book.data.verification.status,
      notes: verificationNotes,
      verifiedAt: verificationStatus === "verified"
        ? book.data.verification.verifiedAt || new Date().toISOString()
        : undefined,
    },
    publication: { status: publicationStatus as typeof book.data.publication.status },
  };

  try {
    await upsertAdminBook(slug, next);
    await writeBookContent(slug, next);
    return json({ message: "Perubahan metadata tersimpan.", slug }, 200);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Metadata tidak dapat disimpan." }, 500);
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const denied = guardLocalRequest(request);
  if (denied) return denied;

  const slug = params.slug ?? "";
  const books = await getAdminBooks(await getCollection("books"), await listDraftBooks());
  const book = books.find(({ data }) => data.slug === slug);
  if (!book) return json({ error: "Buku tidak ditemukan." }, 404);

  const permanentlyDeleteCatalog = new URL(request.url).searchParams.get("mode") === "catalog";

  try {
    if (permanentlyDeleteCatalog) {
      await deleteBookContent(slug);
      await removeAdminBook(slug);
      return json({ message: "Entri katalog dihapus. Berkas EPUB di S3 tidak disentuh.", slug }, 200);
    }

    const next = {
      ...book.data,
      publication: { status: "archived" as const },
      verification: {
        ...book.data.verification,
        notes: [book.data.verification.notes, "Diarsipkan dari halaman admin lokal."].filter(Boolean).join(" "),
      },
    };
    await upsertAdminBook(slug, next);
    await writeBookContent(slug, next);
    return json({ message: "Buku diarsipkan dari katalog publik.", slug }, 200);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Buku tidak dapat diarsipkan." }, 500);
  }
};

function guardLocalRequest(request: Request): Response | undefined {
  if (!import.meta.env.DEV) return json({ error: "Pengelolaan metadata hanya tersedia dari server lokal." }, 403);

  const origin = request.headers.get("origin");
  if (origin !== "http://127.0.0.1:4321" && origin !== "http://localhost:4321") {
    return json({ error: "Asal permintaan tidak diizinkan." }, 403);
  }

  return undefined;
}

function text(value: unknown, maximum: number, allowEmpty = false): string {
  if (typeof value !== "string") return "";
  const result = value.trim();
  return result.length <= maximum && (allowEmpty || result.length > 0) ? result : "";
}

function textList(value: unknown, maximumItems: number): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))]
    .slice(0, maximumItems);
}

function optionalUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") return null;
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function json(body: Record<string, string>, status: number): Response {
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" }, status });
}
