# 04 — Content & Metadata Schema

## 1. Source of Truth

Untuk MVP, katalog buku disimpan menggunakan Astro Content Collections.

```text
src/content/books/
```

Setiap buku mempunyai satu metadata file.

---

## 2. Example Schema

```yaml
id: kemilau-indah-aqidah-imam-syafii
slug: kemilau-indah-aqidah-imam-syafii

title: Kemilau Indah Aqidah Imam Asy-Syafi'i

authors:
  - Yusuf Abu Ubaidah As-Sidawi

categories:
  - aqidah

tags:
  - imam-syafii
  - aqidah
  - manhaj

language:
  - id
  - ar

description: >
  Deskripsi buku.

source:
  publisher: abiubaidah.com
  pageUrl: https://...
  originalPdfUrl: https://...

storage:
  cover: published/books/.../cover.webp
  epub: published/books/.../epub/book.epub
  reader: published/books/.../reader/
  pdf: published/books/.../source/original.pdf

edition:
  label: ""
  year: ""

reading:
  wordCount: 18450
  estimatedMinutes: 92

conversion:
  version: "1.0"
  sourceHash: ""
  epubHash: ""

verification:
  status: verified
  verifiedAt: 2026-09-04
  notes: ""

publication:
  status: published
```

---

## 3. Publication Status

Allowed:

```text
discovered
imported
extracting
converted
needs-review
verified
published
archived
```

Public frontend hanya menampilkan:

```text
published
```

---

## 4. Category Strategy

Kategori awal:

- aqidah;
- manhaj;
- fiqih;
- hadits;
- adab-akhlak;
- tazkiyah;
- keluarga;
- pendidikan;
- ramadhan;
- haji-umrah;
- sirah;
- ulama.

Taxonomy perlu direview secara editorial.

---

## 5. Tags

Tags lebih fleksibel daripada kategori.

Contoh:

```text
shalat
puasa
tauhid
iman
imam-syafii
ramadhan
orang-tua
anak
```

---

## 6. Curated Collections

Collections disimpan terpisah:

```text
src/content/collections/
```

Contoh:

```yaml
title: Mulai Belajar Aqidah
slug: mulai-belajar-aqidah

description: >
  Pilihan bacaan bertahap.

books:
  - book-a
  - book-b
  - book-c
```

---

## 7. Related Books

Boleh manual:

```yaml
related:
  - book-a
  - book-b
```

Jangan langsung membuat related recommendation otomatis tanpa kontrol editorial.

---

## 8. Reading Time

Gunakan word count sebagai estimasi.

Bukan nilai kualitas.

```text
± 45 menit membaca
```

---

## 9. Provenance

Wajib simpan:

- original page URL;
- original PDF URL;
- source publisher/site;
- conversion version;
- verification status;
- source checksum.

---

## 10. Book Manifest

Selain metadata publik, pipeline dapat menghasilkan manifest:

```json
{
  "slug": "book-slug",
  "sourceHash": "sha256...",
  "epubVersion": "1.0",
  "conversionStatus": "verified",
  "verifiedAt": "2026-09-04",
  "storagePrefix": "published/books/book-slug/"
}
```
