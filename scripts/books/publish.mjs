import { CopyObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";

const [slug, version = "1.0.0"] = process.argv.slice(2);
const requiredNames = ["S3_ENDPOINT", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_BUCKET"];
const missing = requiredNames.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Konfigurasi storage belum lengkap: ${missing.join(", ")}`);
  process.exit(1);
}

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("Gunakan: pnpm book:publish -- <slug> [versi-semver], mis. 10-hak-dalam-islam 1.0.0");
  process.exit(1);
}

const bucket = process.env.S3_BUCKET;
const sourceKey = `draft/books/${slug}/epub/book.epub`;
const targetKey = `published/books/${slug}/versions/${version}/book.epub`;
const client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  region: process.env.S3_REGION,
});

try {
  await client.send(new HeadObjectCommand({ Bucket: bucket, Key: sourceKey }));
} catch {
  console.error(`Draft EPUB tidak ditemukan: ${sourceKey}`);
  process.exit(1);
}

try {
  await client.send(new HeadObjectCommand({ Bucket: bucket, Key: targetKey }));
  console.error(`Target publik sudah ada: ${targetKey}. Pilih versi baru agar tidak menimpa berkas.`);
  process.exit(1);
} catch (error) {
  const status = error?.$metadata?.httpStatusCode;
  if (status !== 404) throw error;
}

await client.send(
  new CopyObjectCommand({
    Bucket: bucket,
    ACL: "public-read",
    CacheControl: "public, max-age=31536000, immutable",
    ContentType: "application/epub+zip",
    CopySource: `${bucket}/${sourceKey}`,
    Key: targetKey,
    MetadataDirective: "REPLACE",
  }),
);

console.log(`EPUB diterbitkan ke ${targetKey}`);
