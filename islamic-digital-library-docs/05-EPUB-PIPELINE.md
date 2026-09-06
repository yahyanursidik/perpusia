# 05 — PDF to EPUB Pipeline

## 1. Prinsip

Jangan melakukan:

```text
PDF → EPUB → Publish
```

secara langsung.

PDF sering memiliki struktur visual, bukan semantic structure.

---

## 2. Pipeline

```text
Original PDF
     ↓
Document inspection
     ↓
Text extraction
     ↓
Structure detection
     ↓
Semantic HTML / Markdown
     ↓
Cleanup
     ↓
Arabic/RTL validation
     ↓
Footnote validation
     ↓
EPUB 3 packaging
     ↓
EPUB validation
     ↓
Manual QA
     ↓
Upload
     ↓
Publish
```

---

## 3. HTML-First Approach

Gunakan semantic HTML sebagai intermediate representation.

```text
PDF
 ↓
Semantic HTML
 ├── EPUB
 ├── Search index
 └── Web reader resources
```

Keuntungan:

- lebih mudah diperbaiki;
- mudah dicari;
- tidak vendor-lock ke EPUB;
- dapat dipakai untuk future semantic search.

---

## 4. Chapter Structure

Ideal:

```html
<h1>Judul Bab</h1>
<h2>Subbab</h2>
<p>Paragraf...</p>
```

Jangan menggunakan heading berdasarkan ukuran font hasil ekstraksi saja tanpa review.

---

## 5. Arabic & RTL

Gunakan:

```html
<p lang="ar" dir="rtl">
  ...
</p>
```

CSS:

```css
[dir="rtl"] {
  direction: rtl;
  unicode-bidi: isolate;
}
```

QA khusus:

- harakat;
- punctuation;
- nomor;
- mixed Arabic/Indonesia;
- simbol ﷺ;
- quotation;
- footnote.

---

## 6. Footnotes

Footnote harus tetap terhubung.

Target UX:

```text
teks¹
```

Tap membuka popover / footnote panel.

Jangan memutus reference-footnote relationship.

---

## 7. Headers & Footers

Extraction harus menghapus:

- nomor halaman;
- running header;
- running footer;
- repeated publication footer.

Jangan menghapus konten hanya berdasarkan posisi tanpa pemeriksaan.

---

## 8. Images

Gambar:

- dipertahankan jika bermakna;
- dikompresi;
- diberikan alt text bila relevan;
- tidak dikonversi menjadi dekorasi baru.

---

## 9. EPUB Validation

Sebelum publish:

- package valid;
- TOC valid;
- manifest valid;
- spine valid;
- links valid;
- images resolved;
- CSS resolved;
- metadata valid.

Gunakan EPUB validator yang sesuai pada pipeline.

---

## 10. Conversion Status

```text
discovered
↓
imported
↓
extracting
↓
converted
↓
needs-review
↓
verified
↓
published
```

---

## 11. QA Checklist

Sebuah ebook belum boleh publish bila:

- judul bab rusak;
- urutan paragraf salah;
- teks Arab terbalik;
- footnote hilang;
- gambar salah posisi;
- daftar isi salah;
- bagian teks hilang;
- hasil conversion tidak dapat dibandingkan dengan PDF asli.

---

## 12. CLI Target

```bash
pnpm book:import ./book.pdf
pnpm book:convert book-slug
pnpm book:validate book-slug
pnpm book:upload book-slug
pnpm book:publish book-slug
```

---

## 13. Definition of Done

Satu buku dianggap selesai bila:

- metadata lengkap;
- PDF asli tersedia;
- source hash tersedia;
- semantic structure benar;
- EPUB valid;
- reflow berfungsi;
- TOC berfungsi;
- Arabic lolos QA;
- footnote lolos QA;
- mobile reader lolos QA;
- storage upload selesai;
- status `published`.
