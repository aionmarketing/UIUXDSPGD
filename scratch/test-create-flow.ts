import { createProductAction } from "../src/features/seller-pwa/actions/create-product";
import { getDbProductBySlug, getDbProducts } from "../src/db/queries";

async function runEndToEndTest() {
  console.log("🚀 [Test] Executando teste end-to-end de criação no Neon DB...");

  const testTitle = `Test Supreme Box Logo Hoodie - ${Date.now()}`;
  const result = await createProductAction({
    title: testTitle,
    brand: "Supreme",
    gender: "Masculino",
    category: "Roupas",
    subcategory: "Moletom",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    price: 3200,
    size: "XL",
    weightKg: 0.9,
    description: "Peça de teste automatizada para validação end-to-end do fluxo Neon PostgreSQL.",
    tag: "GRAIL",
    images: [
      {
        url: "/uploads/products/test-hoodie.webp",
        storageKey: "test-key-1",
        isPrimary: true,
        orderIndex: 0,
      },
    ],
    measurements: {
      chest: "64 cm",
      length: "76 cm",
      fit: "Oversized Boxy Fit",
    },
  });

  console.log("Resultado da inserção:", result);

  if (!result.success || !result.slug) {
    throw new Error(`Falha no createProductAction: ${result.error}`);
  }

  // Verify retrieval
  const fetched = await getDbProductBySlug(result.slug);
  console.log("✓ Produto recuperado do Neon PostgreSQL:");
  console.log("  - ID:", fetched?.id);
  console.log("  - Slug:", fetched?.slug);
  console.log("  - Marca:", fetched?.brand);
  console.log("  - Categoria:", fetched?.category);
  console.log("  - Preço: R$", fetched?.price);
  console.log("  - Imagens:", fetched?.images);
  console.log("  - Certificado Forense:", fetched?.forensicReport.certificateId);

  const all = await getDbProducts();
  console.log(`✓ Total de produtos ativos no Neon PostgreSQL: ${all.length}`);
}

runEndToEndTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erro no teste:", err);
    process.exit(1);
  });
