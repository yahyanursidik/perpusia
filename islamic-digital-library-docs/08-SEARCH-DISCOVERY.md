# 08 — Search & Discovery

## 1. Phase 1 Search

Gunakan:

```text
Pagefind
```

Index:

- title;
- author;
- category;
- tag;
- description.

---

## 2. Phase 2 Full-Text Search

Tambahkan index:

- chapter;
- subchapter;
- body;
- footnote tertentu.

Contoh query:

```text
shalat berjamaah
```

Hasil:

```text
Fiqih Shalat
Bab 7 — Hukum Shalat Berjamaah
...
```

Klik membuka bagian tersebut di reader.

---

## 3. Search UX

Search bar:

```text
Cari judul, penulis, atau pembahasan...
```

Hasil dipisahkan:

```text
Buku
Topik / Isi Buku
Kategori
```

---

## 4. Discovery

Jangan hanya alphabetical list.

Gunakan:

- latest books;
- categories;
- collections;
- related books;
- recommended reading;
- short reads.

---

## 5. Curated Collections

Contoh:

- Mulai Belajar Aqidah;
- Adab Penuntut Ilmu;
- Bekal Ramadhan;
- Tentang Shalat;
- Keluarga Muslim;
- Bacaan Ringan.

Collections bersifat editorial.

---

## 6. Related Books

Phase 1:

manual metadata.

Phase berikutnya:

kombinasi editorial + similarity.

Editorial tetap memiliki override.

---

## 7. Deep Links

Target fase lanjutan:

```text
/read/book-slug#locator
```

atau locator berbasis EPUB CFI.

Gunakan abstraction supaya URL publik tidak terlalu terikat pada library engine.

---

## 8. Reading Time

Tampilkan estimasi:

```text
± 45 menit membaca
```

Gunakan hanya sebagai bantuan discovery.

---

## 9. Future Semantic Search

Jangan implementasikan sebelum:

- clean semantic corpus tersedia;
- full-text search stabil;
- metadata konsisten;
- QA conversion matang.

Semantic search adalah fase lanjutan, bukan MVP.
