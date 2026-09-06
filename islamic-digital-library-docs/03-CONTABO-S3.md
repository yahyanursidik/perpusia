# 03 — Contabo S3 Storage

## 1. Peran Storage

Contabo Object Storage digunakan untuk menyimpan binary assets:

- PDF asli;
- EPUB;
- unpacked EPUB;
- cover;
- image;
- font khusus bila legal;
- file pendukung.

Astro/Vercel tidak digunakan sebagai gudang ebook.

---

## 2. Environment Variables

```env
S3_ENDPOINT=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET=
S3_PUBLIC_BASE_URL=
```

Credential tidak boleh diberi prefix `PUBLIC_`.

---

## 3. AWS SDK

Gunakan:

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/lib-storage
```

Contoh adapter:

```ts
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
```

---

## 4. Path-Style

Contabo menggunakan S3-compatible endpoint dengan path-style bucket addressing.

Gunakan:

```ts
forcePathStyle: true
```

Jangan mengasumsikan virtual-host style AWS.

---

## 5. Bucket Strategy

MVP cukup satu bucket.

Contoh:

```text
islamic-library
```

Jangan satu bucket per buku.

---

## 6. Object Key Structure

```text
books/
  {book-slug}/
    source/
      original.pdf
    epub/
      book.epub
    reader/
      META-INF/
      EPUB/
      mimetype
    assets/
    cover.webp
```

---

## 7. Draft vs Published

Gunakan prefix:

```text
draft/
published/
```

Contoh:

```text
draft/books/book-slug/
published/books/book-slug/
```

Hanya published yang diekspos publik.

---

## 8. Versioning

Hindari overwrite diam-diam.

Contoh:

```text
published/books/{slug}/versions/1.0/
published/books/{slug}/versions/1.1/
```

Metadata menunjuk versi aktif.

---

## 9. Public URL Abstraction

Jangan menulis endpoint Contabo mentah di semua metadata.

Gunakan:

```env
S3_PUBLIC_BASE_URL=https://assets.example.id
```

Lalu object path:

```yaml
storage:
  epub: books/.../book.epub
```

Application membentuk URL akhir.

---

## 10. MIME Types

Gunakan:

```text
.pdf    application/pdf
.epub   application/epub+zip
.xhtml  application/xhtml+xml
.css    text/css
.webp   image/webp
.svg    image/svg+xml
.json   application/json
```

---

## 11. Cache Control

Immutable/versioned asset:

```text
Cache-Control: public, max-age=31536000, immutable
```

Metadata yang berubah:

```text
Cache-Control: public, max-age=300
```

Jangan memberi immutable pada file yang akan ditimpa.

---

## 12. CORS

Frontend publik minimal memerlukan:

```text
GET
HEAD
```

Origin produksi:

```text
https://domain-library.id
```

Origin development:

```text
http://localhost:4321
```

Jangan memberi browser publik permission untuk PUT/DELETE.

---

## 13. Credential Policy

Credential write hanya dipakai oleh:

- script;
- CI;
- build tooling;
- admin/import utility.

Browser publik tidak pernah memperoleh credential.

---

## 14. Checksum

Generate SHA-256:

```text
original.pdf
book.epub
```

Digunakan untuk:

- integrity;
- duplicate detection;
- audit;
- version detection.

---

## 15. Backup

Minimum:

```text
Contabo Object Storage
        ↓
scheduled backup
        ↓
external / local archive
```

Prioritas backup:

- original PDF;
- cleaned HTML/Markdown;
- metadata;
- verified EPUB.

---

## 16. CLI Utilities

Target command:

```bash
pnpm book:upload
pnpm book:sync
pnpm storage:check
pnpm storage:backup
```

Gunakan adapter internal atau tools seperti `rclone` untuk bulk operation.
