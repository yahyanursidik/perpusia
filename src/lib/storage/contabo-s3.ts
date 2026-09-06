import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { getStorageEnvironment } from "../env";
import type { ObjectMetadata, ObjectStorage, UploadObjectOptions } from "./types";

export class ContaboS3Storage implements ObjectStorage {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor() {
    const environment = getStorageEnvironment();

    this.bucket = environment.bucket;
    this.publicBaseUrl = environment.publicBaseUrl.replace(/\/+$/, "");
    this.client = new S3Client({
      credentials: {
        accessKeyId: environment.accessKeyId,
        secretAccessKey: environment.secretAccessKey,
      },
      endpoint: environment.endpoint,
      forcePathStyle: true,
      region: environment.region,
    });
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch (error) {
      if (isMissingObjectError(error)) return false;
      throw error;
    }
  }

  async download(key: string): Promise<{ body: ReadableStream<Uint8Array>; contentType?: string | undefined }> {
    const object = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    if (!object.Body) throw new Error("Objek storage tidak memiliki isi.");

    return {
      body: object.Body.transformToWebStream(),
      contentType: object.ContentType,
    };
  }

  async getMetadata(key: string): Promise<ObjectMetadata | undefined> {
    try {
      const object = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));

      return {
        contentLength: object.ContentLength,
        contentType: object.ContentType,
        eTag: object.ETag,
        lastModified: object.LastModified,
      };
    } catch (error) {
      if (isMissingObjectError(error)) return undefined;
      throw error;
    }
  }

  async listKeys(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const result = await this.client.send(new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }));
      result.Contents?.forEach((object) => {
        if (object.Key) keys.push(object.Key);
      });
      continuationToken = result.IsTruncated ? result.NextContinuationToken : undefined;
    } while (continuationToken);

    return keys;
  }

  getPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key.replace(/^\/+/, "")}`;
  }

  async upload({ body, cacheControl, contentType, key }: UploadObjectOptions): Promise<void> {
    const upload = new Upload({
      client: this.client,
      params: {
        Body: body,
        Bucket: this.bucket,
        CacheControl: cacheControl,
        ContentType: contentType,
        Key: key,
      },
    });

    await upload.done();
  }
}

function isMissingObjectError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const candidate = error as { $metadata?: { httpStatusCode?: number }; name?: string };
  return candidate.$metadata?.httpStatusCode === 404 || candidate.name === "NotFound";
}
