import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db, mediaFiles } from "@/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    filename: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { filename } = await params;

    if (!filename || filename.includes("..")) {
      return new NextResponse("Filename inválido.", { status: 400 });
    }

    // 1. Fast path: check if file is present on local disk (dev environment)
    try {
      const localPath = path.join(process.cwd(), "public", "uploads", "products", filename);
      if (fs.existsSync(localPath)) {
        const fileBuffer = await fs.promises.readFile(localPath);
        const ext = path.extname(filename).toLowerCase();
        const mime =
          ext === ".webp"
            ? "image/webp"
            : ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : "image/webp";

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": mime,
            "Content-Length": fileBuffer.length.toString(),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // Continue to DB lookup if disk access is unavailable or errors
    }

    // 2. Persistent path: retrieve from Neon PostgreSQL
    const record = await db.query.mediaFiles.findFirst({
      where: eq(mediaFiles.key, filename),
    });

    if (!record || !record.data) {
      return new NextResponse("Imagem não encontrada.", { status: 404 });
    }

    const imageBuffer = Buffer.from(record.data, "base64");

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": record.mimeType || "image/webp",
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: `W/"${record.key}"`,
      },
    });
  } catch (error) {
    console.error("[Media Serve Error]:", error);
    return new NextResponse("Erro ao servir imagem.", { status: 500 });
  }
}
