import type { APIRoute } from "astro";

import { getVisibleBooks } from "../../../../lib/books/queries";
import { ContaboS3Storage } from "../../../../lib/storage";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const books = await getVisibleBooks();
  const book = books.find(({ data }) => data.slug === params.slug);
  const epubKey = book?.data.storage.epub;
  if (!epubKey) return new Response("EPUB tidak ditemukan.", { status: 404 });

  try {
    const object = await new ContaboS3Storage().download(epubKey);
    return new Response(object.body, {
      headers: {
        "cache-control": "public, max-age=3600",
        "content-type": object.contentType || "application/epub+zip",
      },
    });
  } catch {
    return new Response("EPUB belum dapat diambil dari storage.", { status: 502 });
  }
};
