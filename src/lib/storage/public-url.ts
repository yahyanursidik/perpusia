import { getStorageEnvironment } from "../env";

/** Converts an S3 object key into an image URL without changing local or already-public URLs. */
export function getPublicAssetUrl(asset?: string): string | undefined {
  if (!asset) return undefined;
  if (asset.startsWith("/") || /^https?:\/\//i.test(asset)) return asset;

  try {
    const baseUrl = getStorageEnvironment().publicBaseUrl.replace(/\/+$/, "");
    return `${baseUrl}/${asset.replace(/^\/+/, "")}`;
  } catch {
    return undefined;
  }
}
