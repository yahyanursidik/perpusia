# 02 — System Architecture

## 1. High-Level Architecture

```text
                    SOURCE WEBSITE
                         PDF
                          │
                          ▼
                CONTENT INGESTION
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
             Metadata          Original PDF
                │
                ▼
          Conversion Pipeline
                │
       PDF → HTML → EPUB 3
                │
       ┌────────┼─────────┐
       │        │         │
       ▼        ▼         ▼
     EPUB     Reader     Search
              Assets     Content
       │        │
       └────┬───┘
            │
            ▼
      CONTABO OBJECT STORAGE
            │
            ▼
        ASTRO WEBSITE
            │
            ▼
          VERCEL
            │
            ▼
          WEB + PWA
```

---

## 2. Separation of Concerns

### Astro + Vercel

Menangani:

- UI;
- routing;
- static content;
- metadata;
- search UI;
- reader shell;
- PWA shell.

### Contabo S3

Menangani:

- PDF;
- EPUB;
- unpacked EPUB;
- cover;
- image;
- binary assets.

### Local Browser Storage

Menangani:

- progress;
- bookmark;
- history;
- reader settings;
- offline books.

---

## 3. Core Architectural Decisions

### ADR-001

PDF bukan format baca utama.

### ADR-002

EPUB 3 reflowable menjadi format baca utama.

### ADR-003

PDF asli tetap dipertahankan.

### ADR-004

Binary ebook tidak dimasukkan ke Git.

### ADR-005

Binary ebook tidak disimpan di Vercel.

### ADR-006

Contabo Object Storage menjadi storage utama.

### ADR-007

Frontend tidak boleh memperoleh S3 secret.

### ADR-008

MVP tanpa authentication.

### ADR-009

MVP tanpa database.

### ADR-010

Progress membaca disimpan lokal.

### ADR-011

Semantic HTML menjadi intermediate representation.

### ADR-012

Tidak ada auto-publish setelah conversion.

---

## 4. Recommended Project Structure

```text
/
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── library/
│   │   ├── books/
│   │   ├── read/
│   │   ├── category/
│   │   ├── collection/
│   │   ├── search/
│   │   └── my-library/
│   ├── content/
│   │   ├── books/
│   │   └── collections/
│   ├── features/
│   │   ├── reader/
│   │   ├── library/
│   │   ├── search/
│   │   └── offline/
│   ├── lib/
│   │   ├── storage/
│   │   ├── epub/
│   │   └── books/
│   └── styles/
├── scripts/
│   └── books/
│       ├── import.ts
│       ├── convert.ts
│       ├── validate.ts
│       ├── upload.ts
│       └── publish.ts
├── docs/
└── astro.config.mjs
```

---

## 5. Dependency Direction

```text
UI
↓
Features
↓
Domain / Application
↓
Adapters
↓
External Services
```

UI tidak boleh bergantung langsung pada implementasi Contabo S3.

---

## 6. Storage Adapter

Gunakan abstraction:

```ts
interface ObjectStorage {
  upload(): Promise<void>;
  delete(): Promise<void>;
  exists(): Promise<boolean>;
  getPublicUrl(): string;
}
```

Implementasi:

```text
src/lib/storage/contabo-s3.ts
```

Tujuan:

- mudah test;
- mudah migrate;
- tidak vendor-lock di seluruh codebase.

---

## 7. Reader Adapter

Jangan expose `epub.js` ke seluruh application.

```text
reader-engine.ts
epubjs-engine.ts
```

Dengan interface domain sendiri.

---

## 8. Database Strategy

Phase 1:

```text
Astro Content Collections
+
Contabo S3
+
IndexedDB
```

Database baru dipertimbangkan jika muncul kebutuhan:

- admin web;
- multi-editor;
- correction workflow;
- account sync;
- ribuan publication records dinamis;
- API publik.
