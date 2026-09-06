import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { CATALOG_PRODUCTS } from "../features/storefront/data/products";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_HyG9a8FxUljm@ep-empty-scene-ackp4tg2.sa-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

export async function seedDatabase() {
  console.log("⚡ [Seed] Verificando e sincronizando catálogo no Neon PostgreSQL...");

  // 1. Ensure default seller exists
  let seller = await db.query.sellers.findFirst();
  if (!seller) {
    const [createdSeller] = await db
      .insert(schema.sellers)
      .values({
        name: "Desapegado Curadoria & Arquivo",
        email: "curadoria@desapegado.com",
        rating: "5.00",
        salesCount: 42,
        location: "São Paulo, SP",
        verified: true,
      })
      .returning();
    seller = createdSeller;
    console.log("✓ Vendedor padrão criado:", seller.id);
  }

  // 2. Fetch existing product slugs
  const existingProducts = await db.query.products.findMany();
  const existingSlugs = new Set(existingProducts.map((p) => p.slug));

  let insertedCount = 0;

  for (const item of CATALOG_PRODUCTS) {
    if (existingSlugs.has(item.slug)) {
      continue;
    }

    // Insert product
    const [insertedProduct] = await db
      .insert(schema.products)
      .values({
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        gender: item.gender,
        category: item.category,
        subcategory: item.subcategory,
        condition: item.condition,
        conditionLabel: item.conditionLabel,
        conditionNotes: item.conditionNotes,
        price: item.price.toString(),
        originalRetailPrice: item.originalRetailPrice ? item.originalRetailPrice.toString() : null,
        size: item.size,
        weightKg: (item.weightKg || 0.5).toString(),
        description: item.description,
        tag: item.tag || "ARQUIVO",
        status: "ACTIVE",
        sellerId: seller.id,
      })
      .returning();

    // Insert images
    if (item.images && item.images.length > 0) {
      await db.insert(schema.productImages).values(
        item.images.map((imgUrl, idx) => ({
          productId: insertedProduct.id,
          imageUrl: imgUrl,
          storageKey: `catalog-${insertedProduct.id}-${idx}`,
          orderIndex: idx,
          isPrimary: idx === 0,
        }))
      );
    }

    // Insert forensic report
    if (item.forensicReport) {
      await db.insert(schema.forensicReports).values({
        productId: insertedProduct.id,
        certificateId: item.forensicReport.certificateId,
        inspector: item.forensicReport.inspector,
        inspectionDate: item.forensicReport.inspectionDate,
        overallGrade: item.forensicReport.overallGrade,
        stitchPrecision: item.forensicReport.details?.stitchPrecision || "Conforme",
        labelHologram: item.forensicReport.details?.labelHologram || "Autêntico",
        fabricDensity: item.forensicReport.details?.fabricDensity || "480 GSM",
        serialMatch: item.forensicReport.details?.serialMatch || "Verificado",
        blockchainTxHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      });
    }

    // Insert measurements
    if (item.measurements) {
      await db.insert(schema.productMeasurements).values({
        productId: insertedProduct.id,
        chest: item.measurements.chest || null,
        length: item.measurements.length || null,
        shoulders: item.measurements.shoulders || null,
        insole: item.measurements.insole || null,
        fit: item.measurements.fit,
      });
    }

    insertedCount++;
  }

  console.log(`✓ [Seed] Finalizado! ${insertedCount} novos produtos inseridos no Neon DB.`);
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Erro no seed:", err);
      process.exit(1);
    });
}
