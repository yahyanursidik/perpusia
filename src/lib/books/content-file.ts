import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { BookEntry } from "./queries";

export type BookData = BookEntry["data"];

type CatalogRegistry = {
  version: 1;
  books: Record<string, BookData>;
  deletedSlugs: string[];
};

const catalogDirectory = resolve(process.cwd(), "src", "data");
const catalogRegistryPath = resolve(catalogDirectory, "admin-catalog.json");

export async function writeBookContent(slug: string, data: BookData): Promise<void> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug buku tidak valid.");

  const filePath = resolve(process.cwd(), "src", "content", "books", `${slug}.md`);
  let current: string;
  try {
    current = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingFile(error)) {
      await createBookContent(slug, data);
      return;
    }
    throw error;
  }
  const frontmatter = current.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (!frontmatter) throw new Error("Frontmatter buku tidak ditemukan.");

  const body = current.slice(frontmatter[0].length).replace(/^\r?\n/, "");
  await writeFile(filePath, `${serializeBook(data)}${body}`, "utf8");
}

export async function createBookContent(slug: string, data: BookData): Promise<void> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug buku tidak valid.");

  const filePath = resolve(process.cwd(), "src", "content", "books", `${slug}.md`);
  await writeFile(filePath, serializeBook(data), { encoding: "utf8", flag: "wx" });
}

export async function deleteBookContent(slug: string): Promise<void> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug buku tidak valid.");

  const filePath = resolve(process.cwd(), "src", "content", "books", `${slug}.md`);
  try {
    await unlink(filePath);
  } catch (error) {
    if (!isMissingFile(error)) throw error;
  }
}

export async function getAdminBooks(
  contentBooks: readonly BookEntry[],
  supplementalBooks: readonly BookData[] = [],
): Promise<Array<{ data: BookData }>> {
  const registry = await readCatalogRegistry();
  const deleted = new Set(registry.deletedSlugs);
  const entries = new Map<string, { data: BookData }>();

  const localEntries = await Promise.all(contentBooks.map(async ({ data }) => {
    if (deleted.has(data.slug) || !await hasBookContent(data.slug)) return undefined;
    return { data };
  }));
  localEntries.forEach((entry) => {
    if (entry) entries.set(entry.data.slug, entry);
  });
  supplementalBooks.forEach((data) => {
    if (!deleted.has(data.slug)) entries.set(data.slug, { data });
  });
  Object.values(registry.books).forEach((data) => entries.set(data.slug, { data }));

  return [...entries.values()].toSorted((a, b) => a.data.title.localeCompare(b.data.title, "id"));
}

export async function upsertAdminBook(slug: string, data: BookData): Promise<void> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug buku tidak valid.");

  const registry = await readCatalogRegistry();
  registry.books[slug] = data;
  registry.deletedSlugs = registry.deletedSlugs.filter((item) => item !== slug);
  await writeCatalogRegistry(registry);
}

export async function removeAdminBook(slug: string): Promise<void> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Slug buku tidak valid.");

  const registry = await readCatalogRegistry();
  delete registry.books[slug];
  if (!registry.deletedSlugs.includes(slug)) registry.deletedSlugs.push(slug);
  await writeCatalogRegistry(registry);
}

async function readCatalogRegistry(): Promise<CatalogRegistry> {
  try {
    const raw = await readFile(catalogRegistryPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<CatalogRegistry>;
    return {
      version: 1,
      books: parsed.books && typeof parsed.books === "object" ? parsed.books as Record<string, BookData> : {},
      deletedSlugs: Array.isArray(parsed.deletedSlugs) ? parsed.deletedSlugs.filter((slug): slug is string => typeof slug === "string") : [],
    };
  } catch (error) {
    if (isMissingFile(error)) return { version: 1, books: {}, deletedSlugs: [] };
    throw error;
  }
}

async function writeCatalogRegistry(registry: CatalogRegistry): Promise<void> {
  await mkdir(catalogDirectory, { recursive: true });
  await writeFile(catalogRegistryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
}

function isMissingFile(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

async function hasBookContent(slug: string): Promise<boolean> {
  try {
    await access(resolve(process.cwd(), "src", "content", "books", `${slug}.md`));
    return true;
  } catch {
    return false;
  }
}

function serializeBook(data: BookData): string {
  const lines = [
    "---",
    scalar("id", data.id),
    scalar("slug", data.slug),
    scalar("title", data.title),
    ...stringArray("authors", data.authors),
    ...stringArray("categories", data.categories),
    ...stringArray("tags", data.tags),
    ...stringArray("language", data.language),
    scalar("description", data.description),
    "source:",
    scalar("  publisher", data.source.publisher),
    ...optionalScalar("  pageUrl", data.source.pageUrl),
    ...optionalScalar("  originalPdfUrl", data.source.originalPdfUrl),
    "storage:",
    ...optionalScalar("  cover", data.storage.cover),
    ...optionalScalar("  epub", data.storage.epub),
    ...optionalScalar("  reader", data.storage.reader),
    ...optionalScalar("  pdf", data.storage.pdf),
    "edition:",
    scalar("  label", data.edition.label),
    scalar("  year", data.edition.year),
    "reading:",
    `  wordCount: ${data.reading.wordCount}`,
    `  estimatedMinutes: ${data.reading.estimatedMinutes}`,
    "conversion:",
    scalar("  version", data.conversion.version),
    ...optionalScalar("  sourceHash", data.conversion.sourceHash),
    ...optionalScalar("  epubHash", data.conversion.epubHash),
    "verification:",
    scalar("  status", data.verification.status),
    ...optionalScalar("  verifiedAt", data.verification.verifiedAt),
    scalar("  notes", data.verification.notes),
    "publication:",
    scalar("  status", data.publication.status),
    ...stringArray("related", data.related),
    `mock: ${data.mock}`,
    `preview: ${data.preview}`,
    "---",
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function scalar(key: string, value: string): string {
  return `${key}: ${JSON.stringify(value)}`;
}

function optionalScalar(key: string, value?: string): string[] {
  return value ? [scalar(key, value)] : [];
}

function stringArray(key: string, values: readonly string[]): string[] {
  return values.length === 0
    ? [`${key}: []`]
    : [`${key}:`, ...values.map((value) => `  - ${JSON.stringify(value)}`)];
}
