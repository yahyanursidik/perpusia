# Implementation Status

Dokumen ini mencatat implementasi teknis terhadap `islamic-digital-library-docs/11-ROADMAP.md` dan `12-CODEX-INSTRUCTIONS.md`.

## Phase 0 — Foundation

### Step 1 — Bootstrap

Status: implemented

- [x] Astro project
- [x] Git repository initialized on `main`
- [x] strict TypeScript
- [x] Tailwind CSS
- [x] base folder structure
- [x] type-safe environment schema
- [x] basic accessible layout
- [x] minimal mobile-first homepage
- [x] typed content collection and metadata schema
- [x] three clearly labelled mock-book entries
- [x] library, category, and book-detail routes
- [ ] Contabo storage connection (Step 3)
- [ ] three-book conversion spike (editorial input required)

Quality gate:

- [x] `pnpm lint`
- [x] `pnpm check`
- [x] `pnpm build`

### Step 2 — Content Collections

Status: implemented

- [x] complete typed book schema
- [x] three mock metadata records
- [x] `/library/`
- [x] `/books/[slug]/`
- [x] `/category/` and `/category/[category]/`
- [x] published-only query with an explicit mock-data exception

The mock records do not contain real books and cannot be read. They exist only to verify page structure before the import and conversion pipeline is implemented.

*10 Hak dalam Islam* telah diterbitkan sebagai entri katalog atas permintaan editor. Sampulnya tersedia, sementara sumber bibliografi dan akses baca EPUB masih perlu dilengkapi.

### Fast-path conversion helper

Status: local draft helper implemented ahead of Step 10

- [x] accepts an explicit PDF path or the newest PDF in `local-input/`
- [x] converts with local Calibre `ebook-convert`
- [x] writes only to the ignored `draft/` directory
- [x] never publishes automatically
- [ ] semantic structure, OCR, EPUBCheck, and editorial QA (full Step 10)

### Admin import workbench

Status: local draft form implemented

- [x] `/admin/import/` validates EPUB, optional cover, and required metadata in the browser
- [x] generates a downloadable draft manifest without transmitting binary files
- [x] requires acknowledgement of distribution-rights review
- [ ] protected server upload to private object storage (requires auth and configured Contabo S3)

## Next implementation unit

Step 3 — Storage adapter: implemented and connected to Contabo S3.

- [x] Contabo-compatible adapter with path-style addressing
- [x] object existence, metadata inspection, public URL builder, and server-side upload support
- [x] `pnpm storage:check` and `pnpm book:upload` utilities
- [x] smoke test bucket `perpusia`
- [x] uploaded `10 Hak dalam Islam` EPUB to private `draft/books/10-hak-dalam-islam/epub/book.epub`
- [ ] publish the EPUB to the public prefix only after reader and editorial verification are ready
