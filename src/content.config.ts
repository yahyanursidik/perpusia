import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { BOOK_CATEGORIES } from "./lib/books/categories";

const publicationStatuses = [
  "discovered",
  "imported",
  "extracting",
  "converted",
  "needs-review",
  "verified",
  "published",
  "archived",
] as const;

const books = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/books" }),
  schema: z.object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    authors: z.array(z.string().min(1)).min(1),
    categories: z.array(z.enum(BOOK_CATEGORIES)).min(1),
    tags: z.array(z.string().min(1)).default([]),
    language: z.array(z.string().min(2)).min(1),
    description: z.string().min(1),
    source: z.object({
      publisher: z.string().min(1),
      pageUrl: z.url().optional(),
      originalPdfUrl: z.url().optional(),
    }),
    storage: z
      .object({
        cover: z.string().min(1).optional(),
        epub: z.string().min(1).optional(),
        reader: z.string().min(1).optional(),
        pdf: z.string().min(1).optional(),
      })
      .default({}),
    edition: z.object({
      label: z.string().default(""),
      year: z.string().default(""),
    }),
    reading: z.object({
      wordCount: z.number().int().nonnegative(),
      estimatedMinutes: z.number().int().nonnegative(),
    }),
    conversion: z.object({
      version: z.string().min(1),
      sourceHash: z.string().optional(),
      epubHash: z.string().optional(),
    }),
    verification: z.object({
      status: z.enum(publicationStatuses),
      verifiedAt: z.string().optional(),
      notes: z.string().default(""),
    }),
    publication: z.object({
      status: z.enum(publicationStatuses),
    }),
    related: z.array(z.string()).default([]),
    mock: z.boolean().default(false),
    preview: z.boolean().default(false),
  }),
});

export const collections = { books };
