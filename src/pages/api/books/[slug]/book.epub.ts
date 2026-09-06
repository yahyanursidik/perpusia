import type { APIRoute } from "astro";
import { S3_PUBLIC_BASE_URL } from "astro:env/server";

import { getVisibleBooks } from "../../../../lib/books/queries";
import { ContaboS3Storage } from "../../../../lib/storage";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const books = await getVisibleBooks();
    const book = books.find(({ data }) => data.slug === params.slug);
    const epubKey = book?.data.storage.epub;
    if (!epubKey) return new Response("EPUB tidak ditemukan.", { status: 404 });

    try {
      const object = await new ContaboS3Storage().download(epubKey);
      return epubResponse(object.body, object.contentType);
    } catch (storageError) {
      const publicUrl = getPublicObjectUrl(epubKey);
      if (!publicUrl) throw storageError;

      const fallback = await fetch(publicUrl);
      if (!fallback.ok || !fallback.body) throw storageError;

      console.warn("EPUB served through public storage fallback", { slug: params.slug });
      return epubResponse(fallback.body, fallback.headers.get("content-type") || undefined);
    }
  } catch (error) {
    console.error("EPUB storage request failed", { slug: params.slug, error });
    return new Response("EPUB belum dapat diambil dari storage.", { status: 502 });
  }
};

function epubResponse(body: ReadableStream<Uint8Array>, contentType?: string): Response {
  return new Response(body, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "content-type": contentType || "application/epub+zip",
    },
  });
}

function getPublicObjectUrl(key: string): string | undefined {
  if (!S3_PUBLIC_BASE_URL) return undefined;
  return `${S3_PUBLIC_BASE_URL.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}
