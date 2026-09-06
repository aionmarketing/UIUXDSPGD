import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { getStorageAdapter, type UploadResult } from "@/lib/storage";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "image/heic",
  "image/heif",
]);

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // Aceita até 25MB original do celular para compressão

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
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Formato de arquivo não suportado (${file.type}). Use JPG, PNG, WEBP ou AVIF.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `Arquivo ${file.name} excede o limite de 25MB.`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const rawBuffer = Buffer.from(arrayBuffer);

      let processedBuffer: Buffer = rawBuffer;
      let targetFilename = file.name;
      let targetMimeType = file.type;

      // Otimização inteligente: converte imagens raster (JPG, PNG, etc.) para WebP de alta fidelidade
      if (file.type !== "image/svg+xml") {
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext);
        targetFilename = `${baseName}.webp`;
        targetMimeType = "image/webp";

        processedBuffer = await sharp(rawBuffer)
          .rotate() // Auto-orienta com base no sensor do celular (EXIF)
          .resize({
            width: 1800,
            height: 1800,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({
            quality: 82, // Padrão ouro para moda e arquivo: sem ruído visível, 90% mais leve
            effort: 4,
          })
          .toBuffer();
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
