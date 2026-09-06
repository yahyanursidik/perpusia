import type { APIRoute } from "astro";
import { randomUUID } from "node:crypto";

import { BOOK_CATEGORIES, type BookCategory } from "../../../lib/books/categories";
import { upsertAdminBook, writeBookContent } from "../../../lib/books/content-file";
import { ContaboS3Storage } from "../../../lib/storage";

export const prerender = false;

const maximumFileSize = 100 * 1024 * 1024;
const imageExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) return json({ error: "Unggah hanya tersedia dari server lokal." }, 403);

  const origin = request.headers.get("origin");
  if (origin !== "http://127.0.0.1:4321" && origin !== "http://localhost:4321") {
    return json({ error: "Asal permintaan tidak diizinkan." }, 403);
  }

  const data = await request.formData();
  const epub = getFile(data, "epub");
  const cover = getFile(data, "cover");
  const title = getText(data, "title");
  const author = getText(data, "author");
  const category = getText(data, "category");
  const language = getText(data, "language");
  const description = getText(data, "description");
  const publisher = getText(data, "publisher") || "Belum diverifikasi";
  const sourceUrl = parseOptionalUrl(getText(data, "sourceUrl"));

  if (!epub || !title || !author || !category || !language || !description || data.get("distributionRights") !== "on") {
    return json({ error: "Lengkapi berkas EPUB, metadata wajib, dan konfirmasi hak distribusi." }, 400);
  }
  if (epub.size > maximumFileSize || (cover && cover.size > maximumFileSize)) {
    return json({ error: "Ukuran EPUB atau sampul melebihi batas 100 MB." }, 413);
  }
  if (extensionOf(epub.name) !== "epub") return json({ error: "Berkas utama harus berformat EPUB." }, 400);
  if (cover && !imageExtensions.has(extensionOf(cover.name))) {
    return json({ error: "Sampul harus berformat JPG, PNG, atau WebP." }, 400);
  }
  if (!BOOK_CATEGORIES.includes(category as BookCategory)) return json({ error: "Kategori buku tidak dikenali." }, 400);
  if (sourceUrl === null) return json({ error: "URL sumber asli tidak valid." }, 400);

  const slug = toSlug(title);
  if (!slug) return json({ error: "Judul belum dapat diubah menjadi slug yang valid." }, 400);

  const storage = new ContaboS3Storage();
  const epubKey = `draft/books/${slug}/epub/book.epub`;
  const existingDraft = await storage.exists(epubKey);

  const coverExtension = cover ? extensionOf(cover.name) : undefined;
  const coverKey = cover ? `draft/books/${slug}/cover/cover.${coverExtension}` : undefined;
  if (!existingDraft) {
    await storage.upload({
      body: new Uint8Array(await epub.arrayBuffer()),
      cacheControl: "no-store",
      contentType: "application/epub+zip",
      key: epubKey,
    });
  }
  if (cover && coverKey) {
    await storage.upload({
      body: new Uint8Array(await cover.arrayBuffer()),
      cacheControl: "no-store",
      contentType: cover.type || "application/octet-stream",
      key: coverKey,
    });
  }

  await storage.upload({
    body: JSON.stringify({
      schemaVersion: "draft-import/v1",
      createdAt: new Date().toISOString(),
      status: "draft",
      metadata: { title, author, category, language, publisher, sourceUrl, description },
      assets: { epub: epubKey, cover: coverKey },
      review: { distributionRightsConfirmed: true, publication: "not-requested" },
    }),
    cacheControl: "no-store",
    contentType: "application/json",
    key: `draft/books/${slug}/metadata/import.json`,
  });

  const book = {
    id: randomUUID(),
    slug,
    title,
    authors: author.split(",").map((value) => value.trim()).filter(Boolean),
    contributors: { translators: [], reviewers: [] },
    categories: [category as BookCategory],
    tags: [],
    language: [language],
    description,
    source: { publisher, pageUrl: sourceUrl || undefined },
    storage: { epub: epubKey, cover: coverKey },
    edition: { label: "Belum diverifikasi", year: "" },
    reading: { wordCount: 0, estimatedMinutes: 0 },
    conversion: { version: "uploaded-epub/v1" },
    verification: { status: "needs-review" as const, notes: "Diunggah melalui form admin lokal dan menunggu tinjauan editorial." },
    publication: { status: "imported" as const },
    related: [],
    mock: false,
    preview: false,
  };

  try {
    await upsertAdminBook(slug, book);
    await writeBookContent(slug, book);
  } catch (error) {
    return json({ error: error instanceof Error ? `Berkas sudah terunggah, tetapi registry katalog gagal dibuat: ${error.message}` : "Registry katalog gagal dibuat." }, 500);
  }

  return json({
    slug,
    managementUrl: `/admin/books/${slug}/`,
    message: existingDraft
      ? "Draft yang sudah ada ditemukan dan dipulihkan ke daftar admin. EPUB lama dipertahankan."
      : "Draft baru tersimpan di S3 dan masuk ke daftar admin.",
  }, existingDraft ? 200 : 201);
};

function getFile(data: FormData, name: string): File | undefined {
  const value = data.get(name);
  return value instanceof File && value.size > 0 ? value : undefined;
}

function getText(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function extensionOf(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseOptionalUrl(value: string): string | null {
  if (!value) return "";
  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function json(body: Record<string, string>, status: number): Response {
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" }, status });
}
