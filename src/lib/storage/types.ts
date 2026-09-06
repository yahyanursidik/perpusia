import type { PutObjectCommandInput } from "@aws-sdk/client-s3";

export interface ObjectMetadata {
  contentLength?: number | undefined;
  contentType?: string | undefined;
  eTag?: string | undefined;
  lastModified?: Date | undefined;
}

export interface UploadObjectOptions {
  body: NonNullable<PutObjectCommandInput["Body"]>;
  cacheControl?: string;
  contentType: string;
  key: string;
}

export interface ObjectStorage {
  download(key: string): Promise<{ body: ReadableStream<Uint8Array>; contentType?: string | undefined }>;
  exists(key: string): Promise<boolean>;
  getMetadata(key: string): Promise<ObjectMetadata | undefined>;
  getPublicUrl(key: string): string;
  upload(options: UploadObjectOptions): Promise<void>;
}
