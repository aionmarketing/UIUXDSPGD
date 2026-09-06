import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  storageKey: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface StorageAdapter {
  upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult>;
  delete(storageKey: string): Promise<boolean>;
}

/**
 * Local Disk Storage Adapter (Dev & Self-hosted)
 * Stores files in public/uploads/products and serves them statically.
 */
export class LocalDiskStorageAdapter implements StorageAdapter {
  private uploadDir: string;
  private publicPath: string;

  constructor(subfolder = "products") {
    this.uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);
    this.publicPath = `/uploads/${subfolder}`;

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    const ext = path.extname(originalFilename) || ".jpg";
    const hash = crypto.randomBytes(12).toString("hex");
    const safeBase = path
      .basename(originalFilename, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueFilename = `${Date.now()}-${safeBase}-${hash}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueFilename);

    await fs.promises.writeFile(filePath, buffer);

    return {
      url: `${this.publicPath}/${uniqueFilename}`,
      storageKey: filePath,
      filename: uniqueFilename,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      if (fs.existsSync(storageKey)) {
        await fs.promises.unlink(storageKey);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

/**
 * Cloud Storage Adapter stub ready for S3 / Cloudflare R2 / Neon Storage
 */
export class CloudStorageAdapter implements StorageAdapter {
  async upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    // Fallback to local disk if cloud credentials are not yet configured
    const fallback = new LocalDiskStorageAdapter();
    return fallback.upload(buffer, originalFilename, mimeType);
  }

  async delete(storageKey: string): Promise<boolean> {
    const fallback = new LocalDiskStorageAdapter();
    return fallback.delete(storageKey);
  }
}

export function getStorageAdapter(): StorageAdapter {
  if (process.env.STORAGE_PROVIDER === "s3" || process.env.STORAGE_PROVIDER === "r2") {
    return new CloudStorageAdapter();
  }
  return new LocalDiskStorageAdapter();
}
