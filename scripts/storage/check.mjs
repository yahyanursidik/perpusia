import { HeadBucketCommand, ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const requiredNames = [
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
  "S3_BUCKET",
  "S3_PUBLIC_BASE_URL",
];

const missing = requiredNames.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Konfigurasi storage belum lengkap: ${missing.join(", ")}`);
  process.exit(1);
}

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
  await client.send(new HeadBucketCommand({ Bucket: process.env.S3_BUCKET }));
  console.log("Storage terhubung. Bucket dapat diakses.");
} catch (error) {
  const status = error?.$metadata?.httpStatusCode;

  if (status === 404) {
    try {
      const response = await client.send(new ListBucketsCommand({}));
      const bucketExists = response.Buckets?.some((bucket) => bucket.Name === process.env.S3_BUCKET);
      console.error(
        bucketExists
          ? "Bucket terdeteksi, tetapi endpoint path-style tidak dapat membukanya. Periksa S3_ENDPOINT tanpa nama bucket pada path."
          : "Bucket tidak ditemukan pada akun ini. Periksa S3_BUCKET dan region endpoint Contabo.",
      );
    } catch {
      console.error("Endpoint merespons 404 untuk bucket. Periksa S3_ENDPOINT dan S3_BUCKET di .env.");
    }
  } else if (status === 403) {
    console.error("Akses bucket ditolak. Periksa S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, dan policy bucket.");
  } else {
    console.error(`Smoke test storage gagal${status ? ` (HTTP ${status})` : ""}.`);
  }

  process.exit(1);
}
