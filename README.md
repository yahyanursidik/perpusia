# Perpustakaan Islam Digital

Fondasi aplikasi web/PWA untuk perpustakaan ebook Islam yang mobile-first, tanpa login, dan menjaga provenance sumber.

## Menjalankan proyek

Prasyarat:

- Node.js 22 atau lebih baru
- pnpm 11

```bash
pnpm install
pnpm dev
```

Quality gate:

```bash
pnpm lint
pnpm check
pnpm build
```

## Jalur cepat PDF ke draft EPUB

1. Salin PDF ke `local-input/`.
2. Jalankan `pnpm book:convert`.
3. Periksa hasil di `draft/<slug>/` sebelum metadata diberi status terverifikasi.

Konversi ini memakai `ebook-convert` dari Calibre dan tidak pernah memublikasikan hasil secara otomatis. PDF hasil pindai memerlukan OCR; tata letak kompleks, teks Arab, footnote, dan daftar isi tetap memerlukan pemeriksaan manual.

Salin `.env.example` menjadi `.env` saat konfigurasi object storage mulai digunakan. Jangan memberi prefix `PUBLIC_` pada credential S3.

## Dokumentasi

- Spesifikasi: `islamic-digital-library-docs/`
- Status implementasi: `docs/IMPLEMENTATION-STATUS.md`

Implementasi dilakukan berurutan mengikuti `12-CODEX-INSTRUCTIONS.md`. Phase 0 / Step 2 sudah menyediakan katalog berbasis metadata contoh; unggah PDF, konversi EPUB, dan reader belum diaktifkan.
