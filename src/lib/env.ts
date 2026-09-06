import {
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_PUBLIC_BASE_URL,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "astro:env/server";

const runtimeEnvironment = typeof process === "undefined" ? {} : process.env;

export interface StorageEnvironment {
  accessKeyId: string;
  bucket: string;
  endpoint: string;
  publicBaseUrl: string;
  region: string;
  secretAccessKey: string;
}

const storageValues = {
  // Vercel injects secret values into the serverless runtime. Astro's typed
  // environment values remain the local-development fallback.
  accessKeyId: runtimeEnvironment.S3_ACCESS_KEY_ID || S3_ACCESS_KEY_ID,
  bucket: runtimeEnvironment.S3_BUCKET || S3_BUCKET,
  endpoint: runtimeEnvironment.S3_ENDPOINT || S3_ENDPOINT,
  publicBaseUrl: runtimeEnvironment.S3_PUBLIC_BASE_URL || S3_PUBLIC_BASE_URL,
  region: runtimeEnvironment.S3_REGION || S3_REGION,
  secretAccessKey: runtimeEnvironment.S3_SECRET_ACCESS_KEY || S3_SECRET_ACCESS_KEY,
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
