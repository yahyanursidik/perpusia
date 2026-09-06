# 12 — Codex / Vibe Coding Instructions

## Role

Anda adalah senior full-stack engineer, system architect, accessibility engineer, dan ebook-reader engineer.

Bangun proyek secara bertahap.

Jangan implementasikan seluruh sistem dalam satu langkah.

---

# Global Rules

1. Baca seluruh file `docs/*.md` sebelum coding.
2. Jangan mengubah architecture decision tanpa alasan kuat.
3. Jangan menambahkan database.
4. Jangan menambahkan authentication.
5. Jangan menyimpan PDF/EPUB ke repository.
6. Gunakan Contabo Object Storage melalui S3 adapter.
7. Credential tidak boleh masuk client bundle.
8. Jangan membuat UI generik AI dashboard.
9. Mobile-first.
10. Reader quality lebih penting daripada visual decoration.
11. Semua feature baru harus memiliki loading/error/empty state.
12. Jangan over-engineer.
13. Jalankan lint/typecheck/build sebelum menyatakan selesai.
14. Dokumentasikan perubahan penting.

---

# Stack

Gunakan:

```text
Astro
TypeScript
Tailwind CSS
Vercel
Contabo S3-compatible Object Storage
@aws-sdk/client-s3
@aws-sdk/lib-storage
epub.js
Pagefind
IndexedDB
localStorage
@vite-pwa/astro
Workbox
```

Jangan mengganti library tanpa alasan yang terdokumentasi.

---

# Coding Style

- strict TypeScript;
- small modules;
- feature-based folders;
- clear naming;
- no giant component;
- no giant utility file;
- avoid unnecessary abstraction;
- storage dan reader tetap memakai adapter;
- no hardcoded production URL.

---

# Step 1 — Bootstrap

Kerjakan hanya:

- Astro project;
- TypeScript;
- Tailwind;
- base folder structure;
- env validation;
- basic layout;
- minimal homepage;
- build verification.

Jangan reader dahulu.

Definition of done:

```text
pnpm lint
pnpm check
pnpm build
```

berhasil.

---

# Step 2 — Content Collections

Tambahkan:

- `books` collection;
- schema;
- 3 mock books;
- library route;
- book detail route;
- category route.

Tidak perlu S3 upload dahulu.

---

# Step 3 — Contabo S3 Adapter

Implement:

```text
src/lib/storage/
```

Support:

- object exists;
- public URL builder;
- upload untuk scripts/server;
- metadata inspection.

Pastikan:

```ts
forcePathStyle: true
```

Credential server-only.

Tambahkan test atau smoke-test script.

---

# Step 4 — Reader Proof of Concept

Gunakan hanya 1 EPUB test.

Implement:

```text
/read/[slug]
```

Feature:

- render EPUB;
- TOC;
- continuous mode;
- basic error state.

Jangan theme/settings lengkap dahulu.

---

# Step 5 — Reader UX

Tambahkan:

- font size;
- line height;
- font;
- light/warm/dark;
- scroll/paginated;
- toolbar;
- mobile bottom sheet.

Persist preferences localStorage.

---

# Step 6 — Reading State

Implement IndexedDB:

- progress;
- last location;
- bookmark;
- history.

Tambahkan:

```text
Continue Reading
```

di homepage.

---

# Step 7 — Search

Tambahkan Pagefind.

Search:

- title;
- author;
- description;
- categories;
- tags.

Jangan semantic search.

---

# Step 8 — PWA

Tambahkan:

- manifest;
- icons;
- service worker;
- app shell cache;
- installability.

Jangan cache semua ebook.

---

# Step 9 — Offline Books

Implement explicit:

```text
Simpan untuk Offline
```

Support:

- progress;
- cancel;
- remove;
- quota error;
- offline reader.

---

# Step 10 — Conversion Tooling

Bangun scripts:

```text
scripts/books/import.ts
scripts/books/convert.ts
scripts/books/validate.ts
scripts/books/upload.ts
scripts/books/publish.ts
```

Jangan auto-publish.

Output conversion harus masuk:

```text
draft/
```

hingga verified.

---

# Step 11 — Full Text Search

Setelah corpus semantic HTML stabil:

- index chapter;
- index subchapter;
- deep link hasil;
- highlight query.

---

# Step 12 — Production Hardening

Review:

- accessibility;
- performance;
- security;
- CSP;
- CORS;
- storage cache headers;
- asset versioning;
- EPUB sanitization;
- error monitoring;
- mobile QA.

---

# Anti AI-Slop UI Rules

Dilarang membuat:

- dashboard penuh card;
- gradient dekoratif;
- glassmorphism;
- icon tanpa fungsi;
- hero kosong sangat besar;
- arch/masjid/lentera/mushaf dekoratif;
- generic Islamic ornament;
- excessive rounded cards;
- excessive badges.

Gunakan:

```text
white space
typographic hierarchy
strong book covers
clear navigation
quiet reader
```

---

# Before Every Step

Sebelum coding:

1. baca dokumen terkait;
2. inspect code existing;
3. jelaskan perubahan singkat;
4. implement;
5. test;
6. review diff;
7. update documentation bila perlu.

Jangan menghancurkan pekerjaan sebelumnya.

---

# Final Quality Gate

Sebelum menutup task:

```bash
pnpm lint
pnpm check
pnpm build
```

Pastikan tidak ada:

- secret leakage;
- hardcoded Contabo credential;
- broken route;
- client-side S3 upload credential;
- missing loading/error state;
- unnecessary dependency.
