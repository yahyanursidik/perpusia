# 06 — EPUB Reader Specification

## 1. Goal

Reader harus terasa seperti ruang baca, bukan halaman website.

Prinsip:

> When reading, the interface should disappear.

---

## 2. Reader Engine

Initial engine:

```text
epub.js
```

Bungkus menggunakan adapter.

```text
src/features/reader/
├── reader-engine.ts
├── epubjs-engine.ts
├── reader-state.ts
├── reader-storage.ts
├── reader-theme.ts
└── reader-progress.ts
```

---

## 3. Reading Modes

### Continuous Scroll

Default mobile.

### Paginated

Optional.

User dapat mengubah mode.

---

## 4. Reader Toolbar

Minimal:

```text
Table of Contents
Appearance
Search
Bookmark
More
```

Toolbar disembunyikan selama membaca.

---

## 5. Appearance Settings

Dukung:

- font size;
- line height;
- font family;
- content width;
- text alignment;
- light;
- warm/sepia;
- dark;
- scroll/paginated.

---

## 6. Progress

Simpan:

- book ID;
- EPUB CFI/location;
- progress percentage;
- current chapter;
- updatedAt.

Contoh:

```json
{
  "bookId": "book-slug",
  "location": "epubcfi(...)",
  "progress": 0.42,
  "chapter": "Bab 4",
  "updatedAt": "2026-09-04T10:32:00+07:00"
}
```

---

## 7. Local Persistence

IndexedDB:

- progress;
- bookmarks;
- highlights;
- reading history;
- offline books.

localStorage:

- theme;
- font size;
- line height;
- reading mode.

---

## 8. Continue Reading

Homepage dapat menampilkan:

```text
Lanjutkan Membaca

Kemilau Indah Aqidah...
████████░░░░ 42%

[Lanjutkan]
```

Tanpa login.

---

## 9. Bookmarks

Bookmark menyimpan:

- book;
- location;
- label/chapter;
- createdAt.

---

## 10. Highlights

Phase lanjutan.

Highlight tidak perlu disinkron ke server pada MVP.

---

## 11. Footnotes

Prefer popover/bottom-sheet dibanding lompat jauh ke bagian bawah.

---

## 12. Reader Menu

```text
Tentang Buku
Daftar Isi
Sumber
Lihat PDF Asli
Laporkan Kesalahan
Bagikan
```

---

## 13. Source Integrity

Selalu berikan akses ke:

- source;
- original PDF;
- EPUB version;
- verification information.

---

## 14. Accessibility

Reader harus:

- keyboard accessible;
- respect text scaling;
- mempunyai sufficient contrast;
- tidak memblok browser zoom;
- menggunakan semantic controls;
- menyediakan focus state;
- mempertimbangkan reduced motion.

---

## 15. Performance

Reader JS hanya dimuat di:

```text
/read/*
```

Jangan hydrate seluruh katalog dengan reader engine.
