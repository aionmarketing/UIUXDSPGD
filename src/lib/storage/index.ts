import fs from "fs";
import path from "path";
import crypto from "crypto";
import { db, mediaFiles } from "@/db";
import { eq } from "drizzle-orm";

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
 * Helper to generate a clean, collision-free filename
 */
function generateUniqueFilename(originalFilename: string): { uniqueFilename: string; ext: string } {
  const ext = path.extname(originalFilename) || ".webp";
  const hash = crypto.randomBytes(8).toString("hex");
  const safeBase = path
    .basename(originalFilename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 30);
  const uniqueFilename = `${Date.now()}-${safeBase}-${hash}${ext}`;
  return { uniqueFilename, ext };
}

/**
 * Neon Database Storage Adapter (Universal Serverless + Persistent)
 * Saves optimized WebP media to Neon PostgreSQL and serves them via /uploads/products/[filename].
 * Also writes to local disk in dev when filesystem is writable.
 */
export class NeonDatabaseStorageAdapter implements StorageAdapter {
  private subfolder: string;
  private localUploadDir: string | null = null;

  constructor(subfolder = "products") {
    this.subfolder = subfolder;
    try {
      const dir = path.join(process.cwd(), "public", "uploads", subfolder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.localUploadDir = dir;
    } catch {
      // In serverless environments (Netlify / Lambda / /var/task), filesystem is read-only.
      // Gracefully ignore filesystem initialization failure.
      this.localUploadDir = null;
    }
  }

  async upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    const { uniqueFilename } = generateUniqueFilename(originalFilename);
    const storageKey = uniqueFilename;
    const base64Data = buffer.toString("base64");

    // 1. Persist to Neon PostgreSQL
    await db
      .insert(mediaFiles)
      .values({
        key: storageKey,
        filename: uniqueFilename,
        mimeType,
        data: base64Data,
        size: buffer.length,
      })
      .onConflictDoUpdate({
        target: mediaFiles.key,
        set: {
          data: base64Data,
          size: buffer.length,
          mimeType,
        },
      });

    // 2. Optional: write to local disk as a cache if filesystem is writable
    if (this.localUploadDir) {
      try {
        const localPath = path.join(this.localUploadDir, uniqueFilename);
        await fs.promises.writeFile(localPath, buffer);
      } catch {
        // Ignored on read-only environments
      }
    }

    return {
      url: `/uploads/${this.subfolder}/${uniqueFilename}`,
      storageKey,
      filename: uniqueFilename,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      await db.delete(mediaFiles).where(eq(mediaFiles.key, storageKey));

      if (this.localUploadDir) {
        const localPath = path.join(this.localUploadDir, storageKey);
        if (fs.existsSync(localPath)) {
          await fs.promises.unlink(localPath);
        }
      }
      return true;
    } catch (err) {
      console.warn("[NeonStorage] Falha ao deletar:", err);
      return false;
    }
  }
}

/**
 * Local Disk Storage Adapter (Dev fallback)
 */
export class LocalDiskStorageAdapter implements StorageAdapter {
  private uploadDir: string;
  private publicPath: string;
  private isWritable = true;

  constructor(subfolder = "products") {
    this.uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);
    this.publicPath = `/uploads/${subfolder}`;

    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch {
      this.isWritable = false;
    }
  }

  async upload(buffer: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    if (!this.isWritable) {
      // Fallback to Neon DB if local disk is not writable
      const neonAdapter = new NeonDatabaseStorageAdapter("products");
      return neonAdapter.upload(buffer, originalFilename, mimeType);
    }

    const { uniqueFilename } = generateUniqueFilename(originalFilename);
    const filePath = path.join(this.uploadDir, uniqueFilename);

    try {
      await fs.promises.writeFile(filePath, buffer);
      return {
        url: `${this.publicPath}/${uniqueFilename}`,
        storageKey: filePath,
        filename: uniqueFilename,
        size: buffer.length,
        mimeType,
      };
    } catch {
      // Fallback to Neon if write fails
      const neonAdapter = new NeonDatabaseStorageAdapter("products");
      return neonAdapter.upload(buffer, originalFilename, mimeType);
    }
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
 * Factory for Storage Adapter
 * Defaults to NeonDatabaseStorageAdapter so that uploads work seamlessly
 * in both local dev and serverless Netlify without ENOENT crashes.
 */
export function getStorageAdapter(): StorageAdapter {
  if (process.env.STORAGE_PROVIDER === "local") {
    return new LocalDiskStorageAdapter("products");
  }
  return new NeonDatabaseStorageAdapter("products");
}
