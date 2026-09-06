# 07 — PWA & Offline Reading

## 1. Goal

Website dapat di-install seperti aplikasi dan sebagian fungsi tetap berjalan tanpa internet.

---

## 2. Recommended Stack

```text
@vite-pwa/astro
Workbox
```

---

## 3. Precache

Cache otomatis hanya:

- app shell;
- CSS;
- JS utama;
- icons;
- manifest;
- small static UI assets.

---

## 4. Jangan Precache Semua Ebook

Tidak boleh:

```text
install PWA
↓
download seluruh PDF/EPUB
```

Koleksi bisa sangat besar.

---

## 5. Offline Per Book

User harus memilih:

```text
Simpan untuk Offline
```

Kemudian hanya assets buku itu yang disimpan.

---

## 6. Offline Download UX

```text
Mengunduh buku

████████░░ 76%

18 MB / 24 MB
```

Setelah selesai:

```text
✓ Tersedia Offline
```

---

## 7. Offline Storage

Gunakan kombinasi:

- Cache Storage untuk network resources;
- IndexedDB untuk metadata offline;
- reader state tetap di IndexedDB.

---

## 8. Storage Management

Tampilkan:

```text
Offline Books
3 buku
142 MB
```

User dapat:

- melihat daftar offline;
- menghapus per buku;
- clear semua.

---

## 9. Failure Handling

Jika quota tidak cukup:

```text
Penyimpanan perangkat tidak mencukupi.
Hapus satu atau beberapa buku offline terlebih dahulu.
```

Jangan gagal diam-diam.

---

## 10. Update Strategy

App update tidak boleh menghapus reading progress.

Service worker update harus terpisah dari IndexedDB reader data.

---

## 11. Offline Reader

Jika buku sudah offline:

- cover tersedia;
- TOC tersedia;
- chapter tersedia;
- CSS tersedia;
- image tersedia;
- progress tetap tersimpan.

PDF asli tidak wajib ikut offline kecuali user secara eksplisit memilih.
