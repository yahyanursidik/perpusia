import { BOOK_CATEGORIES, type BookCategory } from "./categories";
import type { BookData } from "./content-file";
import { ContaboS3Storage } from "../storage";

type DraftManifest = {
  metadata?: {
    title?: unknown;
    author?: unknown;
    category?: unknown;
    language?: unknown;
    publisher?: unknown;
    sourceUrl?: unknown;
    description?: unknown;
  };
  assets?: {
    epub?: unknown;
    cover?: unknown;
  };
};

export async function listDraftBooks(): Promise<BookData[]> {
  try {
    const storage = new ContaboS3Storage();
    const manifestKeys = (await storage.listKeys("draft/books/"))
      .filter((key) => /^draft\/books\/[^/]+\/metadata\/import\.json$/.test(key));
    const drafts = await Promise.all(manifestKeys.map((key) => readDraftManifest(storage, key)));
    return drafts.filter((draft): draft is BookData => Boolean(draft));
  } catch {
    return [];
  }
}

async function readDraftManifest(storage: ContaboS3Storage, key: string): Promise<BookData | undefined> {
  try {
    const download = await storage.download(key);
    const manifest = JSON.parse(await new Response(download.body).text()) as DraftManifest;
    const slug = key.split("/")[2] ?? "";
    return toBookData(slug, manifest);
  } catch {
    return undefined;
  }
}

function toBookData(slug: string, manifest: DraftManifest): BookData | undefined {
  const metadata = manifest.metadata;
  if (!metadata || !isSlug(slug)) return undefined;

  const title = text(metadata.title);
  const author = text(metadata.author);
  const category = text(metadata.category);
  const language = text(metadata.language);
  const description = text(metadata.description);
  if (!title || !author || !language || !description || !BOOK_CATEGORIES.includes(category as BookCategory)) return undefined;

  const publisher = text(metadata.publisher) || "Belum diverifikasi";
  const sourceUrl = optionalUrl(metadata.sourceUrl);
  const epub = text(manifest.assets?.epub) || `draft/books/${slug}/epub/book.epub`;
  const cover = text(manifest.assets?.cover) || undefined;

  return {
    id: `draft-${slug}`,
    slug,
    title,
    authors: author.split(",").map((item) => item.trim()).filter(Boolean),
    contributors: { translators: [], reviewers: [] },
    categories: [category as BookCategory],
    tags: [],
    language: [language],
    description,
    source: { publisher, pageUrl: sourceUrl },
    storage: { epub, cover },
    edition: { label: "Belum diverifikasi", year: "" },
    reading: { wordCount: 0, estimatedMinutes: 0 },
    conversion: { version: "uploaded-epub/v1" },
    verification: { status: "needs-review", notes: "Draft dipulihkan dari manifest S3 dan menunggu tinjauan editorial." },
    publication: { status: "imported" },
    related: [],
    mock: false,
    preview: false,
  };
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalUrl(value: unknown): string | undefined {
  const candidate = text(value);
  if (!candidate) return undefined;
  try {
    return new URL(candidate).toString();
  } catch {
    return undefined;
  }
}

function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
