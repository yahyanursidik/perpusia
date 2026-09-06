# 10 — Security & Privacy

## 1. Core Principle

Aplikasi publik tanpa login tetap harus menjaga:

- credential;
- content integrity;
- browser safety;
- privacy reading data.

---

## 2. S3 Credentials

Tidak boleh muncul di:

- frontend;
- browser bundle;
- `PUBLIC_*`;
- Git repository;
- console output.

---

## 3. Least Privilege

Credential ingestion hanya diberi permission yang dibutuhkan.

Pisahkan bila memungkinkan:

- read/public distribution;
- write/publish tooling.

---

## 4. EPUB Sanitization

Anggap EPUB sebagai document input.

Hapus atau blok:

- `<script>`;
- external iframe;
- inline event handlers;
- executable content;
- arbitrary remote scripts.

---

## 5. Generated XHTML

Sanitize sebelum publish.

Jangan memasukkan HTML hasil extraction langsung tanpa validation.

---

## 6. CSP

Gunakan Content Security Policy yang ketat.

Allow hanya source yang memang digunakan:

- self;
- asset domain;
- required fonts/images jika ada.

---

## 7. CORS

S3 read:

```text
GET
HEAD
```

Tidak memberikan public PUT/DELETE.

---

## 8. Privacy

Data berikut tetap lokal pada MVP:

- reading progress;
- bookmark;
- highlight;
- history;
- notes.

Jangan dikirim ke analytics.

---

## 9. Analytics

Boleh ukur:

- pageview;
- book opened;
- reader opened;
- search event;
- offline request;
- EPUB download;
- PDF download.

Hindari menyimpan:

- isi highlight;
- notes;
- precise reading behavior yang tidak dibutuhkan.

---

## 10. Error Reporting

Jangan log:

- S3 secret;
- credential;
- private browser data;
- raw user notes.

---

## 11. Dependency Security

Routine:

```bash
pnpm audit
pnpm outdated
```

Review dependency sebelum upgrade major.

---

## 12. File Validation

Saat ingestion:

- cek MIME;
- cek extension;
- cek size;
- cek checksum;
- cek struktur EPUB;
- reject executable file.

---

## 13. Public Correction Report

Jika nanti ada form “Laporkan Kesalahan”:

- rate limit;
- sanitize input;
- jangan auto-modify content;
- semua report masuk review manual.
