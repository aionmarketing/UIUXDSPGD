import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { getStorageAdapter, type UploadResult } from "@/lib/storage";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
  "application/octet-stream",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
  ".heic",
  ".heif",
]);

const MAX_FILE_SIZE_BYTES = 35 * 1024 * 1024; // Aceita até 35MB original do iOS / celular

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const storage = getStorageAdapter();
    const results: Array<
      UploadResult & {
        originalSizeBytes: number;
        savingsPercent: number;
      }
    > = [];

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      const isMimeAllowed = ALLOWED_MIME_TYPES.has(file.type);
      const isExtAllowed = ALLOWED_EXTENSIONS.has(ext);

      if (!isMimeAllowed && !isExtAllowed) {
        return NextResponse.json(
          {
            success: false,
            error: `Formato de arquivo não suportado (${file.type || ext}). Envie fotos em JPG, PNG, WEBP, HEIC ou AVIF.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `Arquivo ${file.name} excede o limite máximo de 35MB.`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const rawBuffer = Buffer.from(arrayBuffer);

      let processedBuffer: Buffer = rawBuffer;
      let targetFilename = file.name;
      let targetMimeType = file.type || "image/jpeg";

      // Otimização inteligente de alta fidelidade: converte fotos do celular (inclusive iOS HEIC) para WebP
      if (file.type !== "image/svg+xml" && ext !== ".svg") {
        try {
          const baseName = path.basename(file.name, ext);
          targetFilename = `${baseName}.webp`;
          targetMimeType = "image/webp";

          processedBuffer = await sharp(rawBuffer)
            .rotate() // Auto-orienta com base no sensor EXIF do iPhone/Android
            .resize({
              width: 1800,
              height: 1800,
              fit: "inside",
              withoutEnlargement: true,
            })
            .webp({
              quality: 85, // Fidelidade editorial sem ruído visível
              effort: 4,
            })
            .toBuffer();
        } catch (sharpErr) {
          console.warn(`[Upload] Sharp conversão fallback para ${file.name}:`, sharpErr);
          // Fallback gracioso mantendo o buffer original se conversão falhar
          processedBuffer = rawBuffer;
          targetFilename = file.name;
          targetMimeType = file.type || "image/jpeg";
        }
      }

      const uploaded = await storage.upload(processedBuffer, targetFilename, targetMimeType);

      const savings = Math.max(
        0,
        Math.round((1 - processedBuffer.length / file.size) * 100)
      );

      results.push({
        ...uploaded,
        originalSizeBytes: file.size,
        savingsPercent: savings,
      });
    }

    return NextResponse.json({
      success: true,
      files: results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Falha interna no upload";
    console.error("Erro no processamento de fotos:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
