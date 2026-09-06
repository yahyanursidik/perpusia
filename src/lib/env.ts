import {
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_PUBLIC_BASE_URL,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "astro:env/server";

export interface StorageEnvironment {
  accessKeyId: string;
  bucket: string;
  endpoint: string;
  publicBaseUrl: string;
  region: string;
  secretAccessKey: string;
}

const storageValues = {
  accessKeyId: S3_ACCESS_KEY_ID,
  bucket: S3_BUCKET,
  endpoint: S3_ENDPOINT,
  publicBaseUrl: S3_PUBLIC_BASE_URL,
  region: S3_REGION,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
};

export function getStorageEnvironment(): StorageEnvironment {
  const missing = Object.entries(storageValues)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Konfigurasi object storage belum lengkap: ${missing.join(", ")}`);
  }

  return storageValues as StorageEnvironment;
}
