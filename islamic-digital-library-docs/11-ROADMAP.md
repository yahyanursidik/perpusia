# 11 — Development Roadmap

## Phase 0 — Foundation

Tujuan:

- legal/source policy;
- repository setup;
- architecture;
- Contabo storage connection;
- test 3 ebook dengan karakter berbeda.

Deliverables:

- Astro project;
- env schema;
- S3 adapter;
- metadata schema;
- conversion spike.

---

## Phase 1 — Library MVP

Build:

- homepage;
- library;
- categories;
- book detail;
- source attribution;
- Contabo file retrieval;
- EPUB reader;
- PDF source link;
- responsive;
- deploy Vercel.

Exit criteria:

- minimal 3 buku dapat dibaca end-to-end.

---

## Phase 2 — Reader

Tambahkan:

- theme;
- font settings;
- line height;
- continuous/paginated;
- TOC;
- progress;
- continue reading;
- bookmark;
- reading history.

---

## Phase 3 — PWA

Tambahkan:

- installable PWA;
- app shell caching;
- offline per book;
- offline management;
- quota handling.

---

## Phase 4 — Search & Discovery

Tambahkan:

- Pagefind;
- category search;
- collections;
- related books;
- full-text chapter indexing;
- deep links.

---

## Phase 5 — Editorial Pipeline

Tambahkan:

- import script;
- extraction workflow;
- EPUB validator;
- QA checklist;
- versioning;
- checksum;
- draft/publish storage;
- correction reporting.

---

## Phase 6 — Scale

Baru pertimbangkan:

- Neon/PostgreSQL;
- admin dashboard;
- multi-editor;
- account sync;
- semantic search;
- public API.

---

# Prioritas

Urutan prioritas:

```text
Content integrity
↓
Reader quality
↓
Storage reliability
↓
Search
↓
Offline
↓
Automation
↓
Advanced intelligence
```

Bukan sebaliknya.
