# 09 — UI/UX Specification

## 1. Design Direction

Karakter:

- calm;
- clean;
- editorial;
- warm;
- modern;
- serious;
- spacious;
- content-first.

---

## 2. Anti AI-Slop

Hindari:

- arch dekoratif;
- masjid sebagai ornament generik;
- mushaf/kitab sebagai icon generik;
- bulan-bintang;
- lentera;
- geometric pattern berlebihan;
- gradient tanpa fungsi;
- glassmorphism;
- semua elemen dimasukkan card;
- icon untuk setiap poin;
- badge berlebihan;
- hero terlalu besar;
- animasi dekoratif.

Aturan:

> Decoration must mean something.

> Subtract before adding.

---

## 3. Navigation

Desktop:

```text
Logo
Perpustakaan
Kategori
Koleksi
Cari
Perpustakaan Saya
```

Mobile:

```text
Home
Library
Search
My Library
```

Reader memiliki navigation sendiri.

---

## 4. Homepage

```text
Header

Hero
Perpustakaan Islam Digital

Search

Continue Reading
(if any)

Latest Books

Explore Topics

Curated Collections

Recommended Reading

Footer
```

---

## 5. Book Card

Tampilkan seperlunya:

- cover;
- title;
- author;
- category;
- reading time.

Jangan memenuhi card dengan badge.

---

## 6. Book Detail

```text
Cover

Judul
Penulis

Deskripsi

Kategori
Estimasi waktu

[Baca Sekarang]

Download EPUB
PDF Asli

Daftar Isi

Tentang Buku
Sumber
Buku Terkait
```

CTA utama:

```text
Baca Sekarang
```

---

## 7. Reader

Saat membaca:

```text
←               ⋮

Judul Bab

Teks...
Teks...
Teks...

        42%
```

Tap memunculkan toolbar.

---

## 8. Reader Bottom Sheet

Appearance:

```text
Ukuran teks

A−      A      A+

Font
○ Sans
● Serif

Tema
□ Light
□ Warm
□ Dark

Line height
────●────
```

---

## 9. Typography

Prioritas:

- readability;
- Arabic rendering;
- font loading minimum;
- no decorative display font inside reader.

Gunakan font system/default dahulu sebelum menambah banyak webfont.

---

## 10. Responsive

Primary breakpoint design dimulai dari smartphone.

Pastikan reader nyaman pada:

- 360px;
- 390px;
- 430px;
- tablet;
- desktop.

---

## 11. Empty States

Contoh:

```text
Belum ada buku yang disimpan.

Simpan buku yang ingin Anda baca nanti.
[Jelajahi Perpustakaan]
```

---

## 12. Loading

Gunakan skeleton minimal hanya jika benar-benar diperlukan.

Jangan membuat shimmer berlebihan.

---

## 13. Motion

Animation:

- short;
- functional;
- subtle.

Respect:

```css
prefers-reduced-motion
```
