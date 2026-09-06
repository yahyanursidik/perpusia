import { createReadStream, existsSync, statSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

const [inputArgument, slug] = process.argv.slice(2);
const requiredNames = ["S3_ENDPOINT", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_BUCKET"];
const missing = requiredNames.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Konfigurasi storage belum lengkap: ${missing.join(", ")}`);
  process.exit(1);
}

if (!inputArgument || !slug) {
  console.error("Gunakan: pnpm book:upload -- <path-ke-epub> <slug>");
  process.exit(1);
}

const inputPath = resolve(inputArgument);
if (!existsSync(inputPath) || extname(inputPath).toLowerCase() !== ".epub") {
  console.error("Masukkan path EPUB yang valid.");
  process.exit(1);
}

const key = `draft/books/${slug}/epub/book.epub`;
const client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  region: process.env.S3_REGION,
});

console.log(`Mengunggah ${basename(inputPath)} (${Math.ceil(statSync(inputPath).size / 1024)} KB) ke ${key}`);
const upload = new Upload({
  client,
  params: {
    Body: createReadStream(inputPath),
    Bucket: process.env.S3_BUCKET,
    ContentType: "application/epub+zip",
    Key: key,
  },
});

await upload.done();
console.log(`Draft EPUB tersimpan di ${key}. Tidak dipublikasikan otomatis.`);
