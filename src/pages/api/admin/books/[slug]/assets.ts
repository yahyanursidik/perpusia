import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { getAdminBooks, upsertAdminBook, writeBookContent } from "../../../../../lib/books/content-file";
import { listDraftBooks } from "../../../../../lib/books/drafts";
import { ContaboS3Storage } from "../../../../../lib/storage";

export const prerender = false;

const maximumFileSize = 100 * 1024 * 1024;
const imageExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export const POST: APIRoute = async ({ params, request }) => {
  const denied = guardLocalRequest(request);
  if (denied) return denied;

  const slug = params.slug ?? "";
  const books = await getAdminBooks(await getCollection("books"), await listDraftBooks());
  const book = books.find(({ data }) => data.slug === slug);
  if (!book) return json({ error: "Buku tidak ditemukan." }, 404);

  const formData = await request.formData();
  const epub = getFile(formData, "epub");
  const cover = getFile(formData, "cover");
  if (!epub && !cover) return json({ error: "Pilih EPUB atau sampul yang ingin diperbarui." }, 400);
  if ((epub && epub.size > maximumFileSize) || (cover && cover.size > maximumFileSize)) {
    return json({ error: "Ukuran EPUB atau sampul melebihi batas 100 MB." }, 413);
  }
  if (epub && extensionOf(epub.name) !== "epub") return json({ error: "Berkas utama harus berformat EPUB." }, 400);
  if (cover && !imageExtensions.has(extensionOf(cover.name))) {
    return json({ error: "Sampul harus berformat JPG, PNG, atau WebP." }, 400);
  }

  const storage = new ContaboS3Storage();
  const epubKey = `draft/books/${slug}/epub/book.epub`;
  const coverKey = cover ? `draft/books/${slug}/cover/cover.${extensionOf(cover.name)}` : book.data.storage.cover;

  try {
    if (epub) {
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

    const next = {
      ...book.data,
      storage: {
        ...book.data.storage,
        ...(epub ? { epub: epubKey } : {}),
        ...(cover ? { cover: coverKey } : {}),
      },
      conversion: epub ? { ...book.data.conversion, version: "uploaded-epub/v2" } : book.data.conversion,
      verification: epub
        ? {
            ...book.data.verification,
            status: "needs-review" as const,
            verifiedAt: undefined,
            notes: [book.data.verification.notes, "EPUB diperbarui dari editor katalog dan perlu ditinjau kembali."].filter(Boolean).join(" "),
          }
        : book.data.verification,
      publication: epub ? { status: "needs-review" as const } : book.data.publication,
    };
    await upsertAdminBook(slug, next);
    await writeBookContent(slug, next);
    return json({
      message: epub
        ? "EPUB dan metadata berkas tersimpan. Status katalog diubah menjadi Perlu ditinjau."
        : "Sampul baru tersimpan.",
    }, 200);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Berkas tidak dapat diperbarui." }, 500);
  }
};

function getFile(formData: FormData, name: string): File | undefined {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : undefined;
}

function extensionOf(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function guardLocalRequest(request: Request): Response | undefined {
  if (!import.meta.env.DEV) return json({ error: "Pengelolaan berkas hanya tersedia dari server lokal." }, 403);
  const origin = request.headers.get("origin");
  if (origin !== "http://127.0.0.1:4321" && origin !== "http://localhost:4321") {
    return json({ error: "Asal permintaan tidak diizinkan." }, 403);
  }
  return undefined;
}

function json(body: Record<string, string>, status: number): Response {
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" }, status });
}
