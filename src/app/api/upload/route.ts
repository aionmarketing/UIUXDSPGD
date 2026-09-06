import { NextRequest, NextResponse } from "next/server";
import { getStorageAdapter, type UploadResult } from "@/lib/storage";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

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
    const results: UploadResult[] = [];

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
            error: `Arquivo ${file.name} excede o limite máximo de 10MB.`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploaded = await storage.upload(buffer, file.name, file.type);
      results.push(uploaded);
    }

    return NextResponse.json({
      success: true,
      files: results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Falha interna no upload";
    console.error("Erro no upload de fotos:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
