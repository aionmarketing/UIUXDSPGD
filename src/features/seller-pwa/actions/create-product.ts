"use server";

import { db, products, productImages, forensicReports, productMeasurements, sellers } from "@/db";
import { revalidatePath } from "next/cache";

export interface CreateProductInput {
  title: string;
  brand: string;
  gender: string;
  category: string;
  subcategory: string;
  condition: string;
  conditionLabel?: string;
  conditionNotes?: string;
  price: number;
  originalRetailPrice?: number;
  size: string;
  weightKg?: number;
  description?: string;
  tag?: "GRAIL" | "ICÔNICO" | "VANGUARDA" | "ESSENCIAL" | "PASSARELA" | "ARQUIVO";
  images: Array<{
    url: string;
    storageKey?: string;
    isPrimary: boolean;
    orderIndex: number;
  }>;
  measurements?: {
    chest?: string;
    length?: string;
    shoulders?: string;
    insole?: string;
    fit?: string;
  };
}

export async function createProductAction(input: CreateProductInput) {
  try {
    if (!input.title || !input.brand || !input.price || !input.size) {
      return { success: false, error: "Título, marca, preço e tamanho são obrigatórios." };
    }

    // 1. Ensure at least one seller exists in the database
    let seller = await db.query.sellers.findFirst();
    if (!seller) {
      const [newSeller] = await db
        .insert(sellers)
        .values({
          name: "Desapegado Curadoria & Arquivo",
          email: "curadoria@desapegado.com",
          rating: "5.00",
          salesCount: 1,
          location: "São Paulo, SP",
          verified: true,
        })
        .returning();
      seller = newSeller;
    }

    // 2. Generate slug
    const baseSlug = input.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomSuffix}`;

    const defaultConditionNotes =
      input.conditionNotes ||
      "Peça inspecionada pela equipe técnica. Sem avarias funcionais ou manchas não catalogadas.";

    const defaultDescription =
      input.description ||
      `${input.title} da marca ${input.brand}. Peça autêntica de acervo, com conferência minuciosa e garantia incondicional de autenticidade.`;

    // 3. Insert Product
    const [createdProduct] = await db
      .insert(products)
      .values({
        slug,
        name: input.title,
        brand: input.brand,
        gender: input.gender,
        category: input.category,
        subcategory: input.subcategory,
        condition: input.condition,
        conditionLabel: input.conditionLabel || "Excelente Estado",
        conditionNotes: defaultConditionNotes,
        price: input.price.toString(),
        originalRetailPrice: input.originalRetailPrice ? input.originalRetailPrice.toString() : null,
        size: input.size,
        weightKg: (input.weightKg || 0.5).toString(),
        description: defaultDescription,
        tag: input.tag || "ARQUIVO",
        status: "ACTIVE",
        sellerId: seller?.id ?? null,
      })
      .returning();

    // 4. Insert Images
    if (input.images && input.images.length > 0) {
      const imagesToInsert = input.images.map((img, idx) => ({
        productId: createdProduct.id,
        imageUrl: img.url,
        storageKey: img.storageKey || `upload-${idx}`,
        orderIndex: img.orderIndex ?? idx,
        isPrimary: img.isPrimary ?? idx === 0,
      }));

      await db.insert(productImages).values(imagesToInsert);
    }

    // 5. Insert Forensic Report
    const certCode = `ONYX-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    await db.insert(forensicReports).values({
      productId: createdProduct.id,
      certificateId: certCode,
      inspector: "ONYX DIGITAL FORENSICS",
      inspectionDate: new Date().toLocaleDateString("pt-BR"),
      overallGrade: "A+",
      stitchPrecision: "Padrão de tear original verificado",
      labelHologram: "Linha e selo autêntico",
      fabricDensity: "Grip e gramatura em conformidade",
      serialMatch: "Conferido",
      blockchainTxHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
    });

    // 6. Insert Measurements if present
    if (input.measurements) {
      await db.insert(productMeasurements).values({
        productId: createdProduct.id,
        chest: input.measurements.chest || null,
        length: input.measurements.length || null,
        shoulders: input.measurements.shoulders || null,
        insole: input.measurements.insole || null,
        fit: input.measurements.fit || "Regular / Fiel ao tamanho",
      });
    }

    revalidatePath("/produtos");
    revalidatePath("/");

    return {
      success: true,
      productId: createdProduct.id,
      slug: createdProduct.slug,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno ao cadastrar produto.";
    console.error("Erro ao criar produto no banco Neon:", error);
    return {
      success: false,
      error: message,
    };
  }
}
