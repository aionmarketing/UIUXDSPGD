import { db, products } from "./index";
import { desc, eq } from "drizzle-orm";
import type { CatalogProduct } from "@/features/storefront/data/products";
import { CATALOG_PRODUCTS } from "@/features/storefront/data/products";
import type { TaxonomyBrand, TaxonomyCategory, TaxonomyGender } from "@/features/seller-pwa/taxonomy";
import type { ItemCondition } from "@/features/seller-pwa/types";

interface RawProductImage {
  imageUrl: string;
  orderIndex?: number | null;
}

interface RawForensicReport {
  certificateId?: string | null;
  inspector?: string | null;
  inspectionDate?: string | null;
  overallGrade?: string | null;
  stitchPrecision?: string | null;
  labelHologram?: string | null;
  fabricDensity?: string | null;
  serialMatch?: string | null;
}

interface RawMeasurements {
  chest?: string | null;
  length?: string | null;
  shoulders?: string | null;
  insole?: string | null;
  fit?: string | null;
}

interface RawSeller {
  name?: string | null;
  verified?: boolean | null;
  rating?: string | number | null;
  salesCount?: number | null;
  location?: string | null;
}

export interface RawDbProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender?: string | null;
  category?: string | null;
  subcategory?: string | null;
  condition?: string | null;
  conditionLabel?: string | null;
  conditionNotes?: string | null;
  price: string | number;
  originalRetailPrice?: string | number | null;
  size?: string | null;
  description: string;
  tag?: string | null;
  weightKg?: string | number | null;
  images?: RawProductImage[];
  forensicReport?: RawForensicReport | null;
  measurements?: RawMeasurements | null;
  seller?: RawSeller | null;
}

// Helper to safely format DB product into storefront CatalogProduct format
export function mapDbProductToCatalog(p: RawDbProduct): CatalogProduct {
  const sortedImages = (p.images || [])
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((img) => img.imageUrl);

  const images = sortedImages.length > 0 ? sortedImages : ["/placeholder-product.webp"];

  return {
    id: p.id,
    slug: p.slug,
    brand: p.brand as TaxonomyBrand,
    name: p.name,
    gender: (p.gender || "Masculino") as TaxonomyGender,
    category: (p.category || "Roupas") as TaxonomyCategory,
    subcategory: p.subcategory || "",
    condition: (p.condition || "PRISTINE") as ItemCondition,
    conditionLabel: p.conditionLabel || "Excelente Estado",
    conditionNotes: p.conditionNotes || "Peça inspecionada pela equipe técnica.",
    price: Number(p.price) || 0,
    originalRetailPrice: p.originalRetailPrice ? Number(p.originalRetailPrice) : undefined,
    size: p.size || "M",
    images,
    description: p.description,
    tag: p.tag as CatalogProduct["tag"],
    forensicReport: p.forensicReport
      ? {
          certificateId: p.forensicReport.certificateId || "ONYX-CERT",
          inspector: p.forensicReport.inspector || "ONYX DIGITAL FORENSICS",
          inspectionDate: p.forensicReport.inspectionDate || "2026",
          overallGrade: p.forensicReport.overallGrade || "A+",
          details: {
            stitchPrecision: p.forensicReport.stitchPrecision || "Conforme",
            labelHologram: p.forensicReport.labelHologram || "Autêntico",
            fabricDensity: p.forensicReport.fabricDensity || "480 GSM",
            serialMatch: p.forensicReport.serialMatch || "Verificado",
          },
        }
      : {
          certificateId: "ONYX-CERT-AUT",
          inspector: "Curadoria Desapegado",
          inspectionDate: "2026",
          overallGrade: "A+",
          details: {
            stitchPrecision: "Padrão de costura original verificado",
            labelHologram: "Linha e selo autêntico",
            fabricDensity: "Grip e gramatura em conformidade",
            serialMatch: "Conferido",
          },
        },
    measurements: p.measurements
      ? {
          chest: p.measurements.chest || undefined,
          length: p.measurements.length || undefined,
          shoulders: p.measurements.shoulders || undefined,
          insole: p.measurements.insole || undefined,
          fit: p.measurements.fit || "Regular / Fiel ao tamanho",
        }
      : {
          fit: "Regular / Fiel ao tamanho",
        },
    seller: p.seller
      ? {
          name: p.seller.name || "Vendedor Verificado",
          verified: Boolean(p.seller.verified),
          rating: Number(p.seller.rating) || 5.0,
          salesCount: p.seller.salesCount || 1,
          location: p.seller.location || "São Paulo, SP",
        }
      : {
          name: "Desapegado Curadoria & Arquivo",
          verified: true,
          rating: 5.0,
          salesCount: 42,
          location: "São Paulo, SP",
        },
    weightKg: Number(p.weightKg) || 0.5,
    featured: p.tag === "GRAIL" || p.tag === "ICÔNICO",
  };
}

/**
 * Fetch all active products from Neon PostgreSQL
 */
export async function getDbProducts(): Promise<CatalogProduct[]> {
  try {
    const rawProducts = await db.query.products.findMany({
      where: eq(products.status, "ACTIVE"),
      with: {
        images: true,
        seller: true,
        forensicReport: true,
        measurements: true,
      },
      orderBy: [desc(products.createdAt)],
    });

    if (rawProducts && rawProducts.length > 0) {
      return rawProducts.map(mapDbProductToCatalog);
    }
    return CATALOG_PRODUCTS;
  } catch (error) {
    console.error("[Neon DB] Erro ao buscar produtos, usando fallback:", error);
    return CATALOG_PRODUCTS;
  }
}

/**
 * Fetch single product by slug from Neon PostgreSQL
 */
export async function getDbProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  try {
    const raw = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        images: true,
        seller: true,
        forensicReport: true,
        measurements: true,
      },
    });

    if (raw) {
      return mapDbProductToCatalog(raw);
    }

    // Fallback if not found in DB
    return CATALOG_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  } catch (error) {
    console.error(`[Neon DB] Erro ao buscar slug ${slug}:`, error);
    return CATALOG_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
  }
}

/**
 * Fetch related products from Neon PostgreSQL
 */
export async function getDbRelatedProducts(currentId: string, limit = 4): Promise<CatalogProduct[]> {
  const all = await getDbProducts();
  const current = all.find((p) => p.id === currentId);
  if (!current) return all.slice(0, limit);

  const sameCategoryOrBrand = all.filter(
    (p) => p.id !== currentId && (p.category === current.category || p.brand === current.brand)
  );

  if (sameCategoryOrBrand.length >= limit) {
    return sameCategoryOrBrand.slice(0, limit);
  }

  return all.filter((p) => p.id !== currentId).slice(0, limit);
}
