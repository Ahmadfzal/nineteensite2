import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

// Supabase S3-compatible client
export const objectStorageClient = new S3Client({
  region: process.env.SUPABASE_S3_REGION || "ap-southeast-1",
  endpoint: process.env.SUPABASE_S3_ENDPOINT, // e.g. https://xxxx.supabase.co/storage/v1/s3
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.SUPABASE_S3_BUCKET || "";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// Simplified File-like object to maintain compatibility with existing routes
export interface StorageFile {
  bucket: string;
  key: string;
}

export class ObjectStorageService {
  constructor() {}

  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error("PUBLIC_OBJECT_SEARCH_PATHS not set.");
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "uploads";
    return dir;
  }

  async searchPublicObject(filePath: string): Promise<StorageFile | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const key = `${searchPath}/${filePath}`.replace(/^\//, "");
      try {
        await objectStorageClient.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
        return { bucket: BUCKET, key };
      } catch {
        // not found, try next
      }
    }
    return null;
  }

  async downloadObject(file: StorageFile, cacheTtlSec: number = 3600): Promise<Response> {
    const command = new GetObjectCommand({ Bucket: file.bucket, Key: file.key });
    const s3Response = await objectStorageClient.send(command);

    const contentType = s3Response.ContentType || "application/octet-stream";
    const contentLength = s3Response.ContentLength;

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=${cacheTtlSec}`,
    };
    if (contentLength) {
      headers["Content-Length"] = String(contentLength);
    }

    // Convert S3 body stream to Web ReadableStream
    const body = s3Response.Body;
    if (!body) {
      return new Response(null, { headers });
    }

    const webStream = body.transformToWebStream();
    return new Response(webStream, { headers });
  }

  async getObjectEntityUploadURL(): Promise<string> {
    const privateDir = this.getPrivateObjectDir();
    const objectId = randomUUID();
    const key = `${privateDir}/${objectId}`.replace(/^\//, "");

    const command = new PutObjectCommand({ Bucket: BUCKET, Key: key });
    const signedUrl = await getSignedUrl(objectStorageClient, command, { expiresIn: 900 });

    return signedUrl;
  }

  async getObjectEntityFile(objectPath: string): Promise<StorageFile> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const entityId = objectPath.replace("/objects/", "");
    const privateDir = this.getPrivateObjectDir();
    const key = `${privateDir}/${entityId}`.replace(/^\//, "");

    try {
      await objectStorageClient.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
      return { bucket: BUCKET, key };
    } catch {
      throw new ObjectNotFoundError();
    }
  }

  normalizeObjectEntityPath(rawPath: string): string {
    // For Supabase, signed URL will be https://xxxx.supabase.co/storage/...
    // Extract the object key from the URL
    try {
      const url = new URL(rawPath);
      const pathParts = url.pathname.split("/");
      const privateDir = this.getPrivateObjectDir();
      const dirIndex = pathParts.findIndex(p => p === privateDir);
      if (dirIndex !== -1) {
        const entityId = pathParts.slice(dirIndex + 1).join("/");
        return `/objects/${entityId}`;
      }
    } catch {
      // not a URL, return as-is
    }
    return rawPath;
  }

  async trySetObjectEntityAclPolicy(rawPath: string, aclPolicy: ObjectAclPolicy): Promise<string> {
    // ACL not needed for Supabase S3 — bucket policies handle visibility
    return this.normalizeObjectEntityPath(rawPath);
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: StorageFile;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    // Implement your own access control logic here if needed
    return true;
  }
}