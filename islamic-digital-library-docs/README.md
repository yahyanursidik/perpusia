# Islamic Digital Library — Developer Documentation

## Ringkasan

Proyek ini adalah **perpustakaan digital Islam berbasis Web + PWA** dengan fokus utama pada pengalaman membaca ebook yang nyaman di perangkat mobile.

Sumber awal koleksi berasal dari:

- https://abiubaidah.com/ebook/

Aplikasi bersifat:

- publik;
- tanpa login;
- mobile-first;
- PWA;
- EPUB 3 reflowable sebagai format baca utama;
- PDF asli tetap dipertahankan sebagai sumber/reference;
- Contabo S3-compatible Object Storage sebagai storage file;
- Astro sebagai frontend;
- Vercel sebagai deployment;
- IndexedDB/localStorage untuk data personal lokal;
- Pagefind untuk pencarian awal.

---

# Dokumen

Baca dokumen dalam urutan berikut:

1. [`01-PRODUCT-BRIEF.md`](./01-PRODUCT-BRIEF.md)
2. [`02-ARCHITECTURE.md`](./02-ARCHITECTURE.md)
3. [`03-CONTABO-S3.md`](./03-CONTABO-S3.md)
4. [`04-CONTENT-SCHEMA.md`](./04-CONTENT-SCHEMA.md)
5. [`05-EPUB-PIPELINE.md`](./05-EPUB-PIPELINE.md)
6. [`06-READER-SPEC.md`](./06-READER-SPEC.md)
7. [`07-PWA-OFFLINE.md`](./07-PWA-OFFLINE.md)
8. [`08-SEARCH-DISCOVERY.md`](./08-SEARCH-DISCOVERY.md)
9. [`09-UIUX.md`](./09-UIUX.md)
10. [`10-SECURITY-PRIVACY.md`](./10-SECURITY-PRIVACY.md)
11. [`11-ROADMAP.md`](./11-ROADMAP.md)
12. [`12-CODEX-INSTRUCTIONS.md`](./12-CODEX-INSTRUCTIONS.md)

---

# Prinsip Arsitektur Utama

```text
Source PDF
    ↓
Ingestion & QA
    ↓
Semantic HTML
    ↓
EPUB 3 + Reader Assets
    ↓
Contabo Object Storage
    ↓
Astro + Vercel
    ↓
Web / PWA / EPUB Reader
```

---

# Keputusan Penting

- PDF **bukan** reader utama.
- EPUB 3 reflowable menjadi format baca utama.
- PDF asli tetap dipertahankan.
- Binary ebook tidak disimpan di Git repository.
- Binary ebook tidak disimpan di Vercel.
- Contabo Object Storage menjadi primary object storage.
- MVP tidak membutuhkan database.
- MVP tidak membutuhkan authentication.
- Progress membaca disimpan lokal.
- EPUB conversion wajib melewati QA.
- Bahasa Arab/RTL adalah first-class requirement.
- Konten tidak boleh otomatis publish setelah konversi.

---

# Stack Awal

```text
Astro
TypeScript
Tailwind CSS
Vercel
Contabo Object Storage
AWS SDK v3
epub.js
Pagefind
IndexedDB
localStorage
@vite-pwa/astro
Workbox
```

---

# Target Pengalaman

```text
Buka website
    ↓
Cari buku / topik
    ↓
Buka detail
    ↓
Baca Sekarang
    ↓
Reader reflow
    ↓
Atur font / theme
    ↓
Tutup aplikasi
    ↓
Buka kembali
    ↓
Lanjut dari posisi terakhir
```

Tanpa:

```text
register
login
password
profile setup
```
