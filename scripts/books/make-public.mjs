import { HeadObjectCommand, PutObjectAclCommand, S3Client } from "@aws-sdk/client-s3";

const [key] = process.argv.slice(2);
const requiredNames = ["S3_ENDPOINT", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_BUCKET"];
const missing = requiredNames.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Konfigurasi storage belum lengkap: ${missing.join(", ")}`);
  process.exit(1);
}
if (!key?.startsWith("published/books/")) {
  console.error("Kunci harus berada di prefix published/books/. ");
  process.exit(1);
}

const client = new S3Client({
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY },
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  region: process.env.S3_REGION,
});
const bucket = process.env.S3_BUCKET;

await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
await client.send(new PutObjectAclCommand({ ACL: "public-read", Bucket: bucket, Key: key }));
console.log(`Akses publik diberikan untuk ${key}`);
