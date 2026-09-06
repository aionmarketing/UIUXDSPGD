import type {
  TaxonomyBrand,
  TaxonomyCategory,
  TaxonomyGender,
} from "@/features/seller-pwa/taxonomy";
import type { ItemCondition } from "@/features/seller-pwa/types";

export interface ForensicReport {
  certificateId: string;
  inspector: string;
  inspectionDate: string;
  overallGrade: string;
  details: {
    stitchPrecision: string;
    labelHologram: string;
    fabricDensity: string;
    serialMatch: string;
  };
}

export interface ProductMeasurements {
  chest?: string;
  length?: string;
  shoulders?: string;
  insole?: string;
  fit: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  brand: TaxonomyBrand;
  name: string;
  gender: TaxonomyGender;
  category: TaxonomyCategory;
  subcategory: string;
  condition: ItemCondition;
  conditionLabel: string;
  conditionNotes: string;
  price: number;
  originalRetailPrice?: number;
  size: string;
  images: string[];
  description: string;
  tag?: "GRAIL" | "ICÔNICO" | "VANGUARDA" | "ESSENCIAL" | "PASSARELA" | "ARQUIVO";
  forensicReport: ForensicReport;
  measurements: ProductMeasurements;
  seller: {
    name: string;
    verified: boolean;
    rating: number;
    salesCount: number;
    location: string;
  };
  weightKg: number;
  featured?: boolean;
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod-1",
    slug: "supreme-box-logo-crewneck-heavyweight-fleece",
    brand: "Supreme",
    name: "Box Logo Crewneck Heavyweight Fleece",
    gender: "Masculino",
    category: "Roupas",
    subcategory: "Moletom",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    conditionNotes: "Peça lacrada na embalagem selada original de lançamento. Zero lavagens, bordado impecável.",
    price: 2450,
    originalRetailPrice: 2800,
    size: "L",
    images: [
      "https://picsum.photos/800/1000?random=101",
      "https://picsum.photos/800/1000?random=201",
      "https://picsum.photos/800/1000?random=301",
      "https://picsum.photos/800/1000?random=401",
    ],
    description:
      "Moletom icônico Supreme Box Logo Crewneck confeccionado em algodão fleece de gramatura pesada (cross-grain heavyweight 450 GSM). Peça de arquivo contemporâneo com o lendário logo bordado em alta densidade com fidelidade milimétrica.",
    tag: "GRAIL",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0891",
      inspector: "H. Vance (Monolith Forensic Lab)",
      inspectionDate: "Fev/2026",
      overallGrade: "10/10 (DSWT Pristine)",
      details: {
        stitchPrecision: "Ponto duplo cruzado verificado por microscopia",
        labelHologram: "Etiqueta interna com marca d'água Supreme nítida",
        fabricDensity: "450 GSM algodão cross-grain certificado",
        serialMatch: "Etiqueta de SKU coincidente com o drop oficial FW",
      },
    },
    measurements: {
      chest: "62 cm",
      length: "74 cm",
      shoulders: "54 cm",
      fit: "Oversized Streetwear Fit",
    },
    seller: {
      name: "Monolith Curadoria Oficial",
      verified: true,
      rating: 5.0,
      salesCount: 312,
      location: "São Paulo, SP",
    },
    weightKg: 0.95,
    featured: true,
  },
  {
    id: "prod-2",
    slug: "balenciaga-track-2-mesh-optic-white",
    brand: "Balenciaga",
    name: "Track 2.0 Sneaker Mesh Optic White",
    gender: "Masculino",
    category: "Sneakers",
    subcategory: "Balenciaga",
    condition: "PRISTINE",
    conditionLabel: "Impecável / Sem Marcas",
    conditionNotes: "Utilizado unicamente em ensaio editorial em estúdio fechado. Sem marcas de sola ou desgaste.",
    price: 5800,
    originalRetailPrice: 7200,
    size: "42 EU",
    images: [
      "https://picsum.photos/800/1000?random=102",
      "https://picsum.photos/800/1000?random=202",
      "https://picsum.photos/800/1000?random=302",
      "https://picsum.photos/800/1000?random=402",
    ],
    description:
      "O ápice da desconstrução arquitetônica de calçados por Demna Gvasalia. Composto por mais de 176 painéis sobrepostos de mesh técnico, nylon e acabamentos articulados em poliuretano termomoldado com solado volumétrico tratorado.",
    tag: "ICÔNICO",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0742",
      inspector: "A. Sato (Footwear Authenticator)",
      inspectionDate: "Jan/2026",
      overallGrade: "9.9/10 (Studio Pristine)",
      details: {
        stitchPrecision: "Termofusão e costuras estruturais sem rebites soltos",
        labelHologram: "Numeração 42 bordada na biqueira com alinhamento 100%",
        fabricDensity: "Mesh técnico multicamadas e sola EVA de alta densidade",
        serialMatch: "Código de barras da caixa original coincidente com etiqueta da língua",
      },
    },
    measurements: {
      insole: "28.0 cm",
      fit: "True to Size (Fiel à numeração europeia)",
    },
    seller: {
      name: "Acervo Vault Tokyo",
      verified: true,
      rating: 4.9,
      salesCount: 148,
      location: "Curitiba, PR",
    },
    weightKg: 1.85,
    featured: true,
  },
  {
    id: "prod-3",
    slug: "arcteryx-beta-ar-gore-tex-pro-shell-jacket",
    brand: "Arc’teryx",
    name: "Beta AR Gore-Tex Pro Shell Jacket",
    gender: "Masculino",
    category: "Roupas",
    subcategory: "Jaquetas",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    conditionNotes: "Lacrado com todas as tags Gore-Tex Pro Most Rugged intactas.",
    price: 4200,
    originalRetailPrice: 4900,
    size: "M",
    images: [
      "https://picsum.photos/800/1000?random=103",
      "https://picsum.photos/800/1000?random=203",
      "https://picsum.photos/800/1000?random=303",
      "https://picsum.photos/800/1000?random=403",
    ],
    description:
      "A lendária jaqueta all-round da Arc’teryx projetada para condições climáticas extremas. Construída em membrana impermeável e respirável GORE-TEX PRO Most Rugged 3L, com capuz DropHood™ compatível com capacete e zíperes WaterTight™.",
    tag: "VANGUARDA",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0924",
      inspector: "L. Brandão (Techwear Specialist)",
      inspectionDate: "Fev/2026",
      overallGrade: "10/10 (Deadstock Factory)",
      details: {
        stitchPrecision: "Fitas de vedação Gore micro-seam de 8mm intactas",
        labelHologram: "Bordado pássaro fóssil Arc’teryx em relevo exato",
        fabricDensity: "N80d e N40d 3L GORE-TEX PRO testados hidrostaticamente",
        serialMatch: "Etiqueta interna com QR Code de autenticação Arc'teryx ativo",
      },
    },
    measurements: {
      chest: "59 cm",
      length: "72 cm",
      shoulders: "50 cm",
      fit: "Regular Athletic Technical Cut",
    },
    seller: {
      name: "Alpine Archive BR",
      verified: true,
      rating: 5.0,
      salesCount: 89,
      location: "Belo Horizonte, MG",
    },
    weightKg: 0.65,
    featured: true,
  },
  {
    id: "prod-4",
    slug: "bape-1st-camo-shark-full-zip-hoodie",
    brand: "Bape",
    name: "1st Camo Shark Full Zip Hoodie 2024",
    gender: "Masculino",
    category: "Roupas",
    subcategory: "Moletom",
    condition: "GENTLY_USED",
    conditionLabel: "Usado em Bom Estado",
    conditionNotes: "Usado poucas vezes em eventos fechados. Feltro do tubarão e dentes 100% brancos, zíper duplo YKK fluído.",
    price: 2890,
    originalRetailPrice: 3600,
    size: "XL",
    images: [
      "https://picsum.photos/800/1000?random=104",
      "https://picsum.photos/800/1000?random=204",
      "https://picsum.photos/800/1000?random=304",
      "https://picsum.photos/800/1000?random=404",
    ],
    description:
      "O clássico absoluto da cultura streetwear japonesa criado por Nigo. Apresenta a camuflagem 1st Camo em tons de verde oliva e o icônico capuz com aplique de tubarão em feltro e o emblema WGM em ponto chenille no verso.",
    tag: "ICÔNICO",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0618",
      inspector: "H. Vance (Monolith Forensic Lab)",
      inspectionDate: "Jan/2026",
      overallGrade: "9.2/10 (Gently Preserved)",
      details: {
        stitchPrecision: "Costuras internas Bape sem fios soltos",
        labelHologram: "Etiqueta Ape Head na manga esquerda com proporção áurea correta",
        fabricDensity: "100% algodão terry japonês de alta retenção",
        serialMatch: "Etiqueta interna de cuidados dourada (Gold Ape Tag) conferida sob luz UV",
      },
    },
    measurements: {
      chest: "64 cm",
      length: "76 cm",
      shoulders: "55 cm",
      fit: "Relaxed Boxy Fit",
    },
    seller: {
      name: "Tokyo Harajuku Vault",
      verified: true,
      rating: 4.8,
      salesCount: 204,
      location: "São Paulo, SP",
    },
    weightKg: 1.1,
    featured: true,
  },
  {
    id: "prod-5",
    slug: "stussy-cable-knit-wool-beanie-optic-white",
    brand: "Stüssy",
    name: "Cable Knit Wool Beanie Optic White",
    gender: "Masculino",
    category: "Acessórios",
    subcategory: "Gorros",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    conditionNotes: "Novo, nunca utilizado. Etiqueta original e embalagem plástica intacta.",
    price: 680,
    size: "ÚNICO",
    images: [
      "https://picsum.photos/800/1000?random=105",
      "https://picsum.photos/800/1000?random=205",
      "https://picsum.photos/800/1000?random=305",
    ],
    description:
      "Gorro canelado pesado confeccionado em mescla de lã virgem e acrílico térmico com trama de tranças estruturada. Assinatura clássica Stüssy em etiqueta tecida de alta definição na dobra frontal.",
    tag: "ESSENCIAL",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0419",
      inspector: "K. Alencar (Accessories Authenticator)",
      inspectionDate: "Fev/2026",
      overallGrade: "10/10 (DSWT)",
      details: {
        stitchPrecision: "Trama de lã homogênea sem nós ou falhas",
        labelHologram: "Etiqueta Stüssy tecida com tipografia Shawn original",
        fabricDensity: "Fios torcidos duplos térmicos",
        serialMatch: "Tag de papelão com código de barras verificado",
      },
    },
    measurements: {
      fit: "One Size Fits All (Circunferência elástica adaptável)",
    },
    seller: {
      name: "Monolith Curadoria Oficial",
      verified: true,
      rating: 5.0,
      salesCount: 312,
      location: "São Paulo, SP",
    },
    weightKg: 0.22,
    featured: true,
  },
  {
    id: "prod-6",
    slug: "off-white-industrial-buckle-utility-belt-200cm",
    brand: "Off-white",
    name: "Industrial Buckle Utility Belt 200cm",
    gender: "Masculino",
    category: "Acessórios",
    subcategory: "Outros",
    condition: "PRISTINE",
    conditionLabel: "Impecável / Sem Marcas",
    conditionNotes: "Fivela de aço esmaltado sem riscos, cinta de poliamida com costura vermelha intacta.",
    price: 1950,
    originalRetailPrice: 2400,
    size: "ÚNICO",
    images: [
      "https://picsum.photos/800/1000?random=106",
      "https://picsum.photos/800/1000?random=206",
      "https://picsum.photos/800/1000?random=306",
    ],
    description:
      "O acessório definitivo da era de ouro de Virgil Abloh para a Off-White. Cinto industrial de 200cm com trama jacquard 'Off-White™ Will 5,400 lbs Weight Securing System' e fivela de engate rápido em metal preto com acabamento fosco.",
    tag: "ARQUIVO",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0388",
      inspector: "H. Vance (Monolith Forensic Lab)",
      inspectionDate: "Jan/2026",
      overallGrade: "9.8/10 (Pristine Collector)",
      details: {
        stitchPrecision: "Costuras de reforço em travete vermelho impecáveis",
        labelHologram: "Gravação a laser na fivela com profundidade correta",
        fabricDensity: "Fita de poliamida estruturada de 35mm",
        serialMatch: "Etiqueta emborrachada 'Main Label' com lacre de segurança",
      },
    },
    measurements: {
      length: "200 cm",
      fit: "Comprimento extra longo com caimento livre",
    },
    seller: {
      name: "Archive Milão Import",
      verified: true,
      rating: 4.9,
      salesCount: 97,
      location: "Rio de Janeiro, RJ",
    },
    weightKg: 0.35,
    featured: true,
  },
  {
    id: "prod-7",
    slug: "lanvin-curb-skate-sneaker-metallic-laces",
    brand: "Lanvin",
    name: "Curb Skate Sneaker Metallic Laces",
    gender: "Masculino",
    category: "Sneakers",
    subcategory: "Lanvin",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    conditionNotes: "Par totalmente novo na caixa original, inclui dustbags e card de autenticidade Lanvin Paris.",
    price: 6100,
    originalRetailPrice: 7500,
    size: "41 EU",
    images: [
      "https://picsum.photos/800/1000?random=107",
      "https://picsum.photos/800/1000?random=207",
      "https://picsum.photos/800/1000?random=307",
      "https://picsum.photos/800/1000?random=407",
    ],
    description:
      "Inspirado na silhueta do skate dos anos 90, o Lanvin Curb combina couro de bezerro luxuoso, camurça aveludada e mesh técnico com cadarços gigantescos em jacquard chevron com detalhes em fios metálicos reflexivos.",
    tag: "PASSARELA",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0955",
      inspector: "A. Sato (Footwear Authenticator)",
      inspectionDate: "Fev/2026",
      overallGrade: "10/10 (Deadstock Boxed)",
      details: {
        stitchPrecision: "Pesponto fino italiano em couro de bezerro",
        labelHologram: "Logo 'Mère et Enfant' gravado na lingueta acolchoada",
        fabricDensity: "Cadarços de 25mm com fiação de poliéster e lurex",
        serialMatch: "Número de lote na lingueta bate com a palmilha e etiqueta da caixa",
      },
    },
    measurements: {
      insole: "27.2 cm",
      fit: "Generous Padded Fit (Conforto volumoso)",
    },
    seller: {
      name: "Monolith Curadoria Oficial",
      verified: true,
      rating: 5.0,
      salesCount: 312,
      location: "São Paulo, SP",
    },
    weightKg: 2.1,
    featured: true,
  },
  {
    id: "prod-8",
    slug: "palace-tri-ferg-heavy-cotton-tee-onyx",
    brand: "Palace",
    name: "Tri-Ferg Heavy Cotton Tee Onyx",
    gender: "Masculino",
    category: "Roupas",
    subcategory: "Camisetas",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    conditionNotes: "Novo na embalagem selada Palace London. Sem dobras ou vincos de uso.",
    price: 980,
    size: "M",
    images: [
      "https://picsum.photos/800/1000?random=108",
      "https://picsum.photos/800/1000?random=208",
      "https://picsum.photos/800/1000?random=308",
    ],
    description:
      "Camiseta clássica Palace Skateboards confeccionada em malha pesada de algodão ring-spun de 220 GSM na cor Onyx Black. Silk-screen do lendário triângulo de Penrose Tri-Ferg no peito e em grande escala nas costas.",
    tag: "ESSENCIAL",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0210",
      inspector: "L. Brandão (Techwear Specialist)",
      inspectionDate: "Fev/2026",
      overallGrade: "10/10 (DSWT)",
      details: {
        stitchPrecision: "Gola canelada de 1.25 polegada com pesponto duplo",
        labelHologram: "Etiqueta interna serigrafada Palace London com símbolo Triferg",
        fabricDensity: "Algodão 220 GSM penteado de toque sedoso",
        serialMatch: "Lacre plástico Palace inviolado",
      },
    },
    measurements: {
      chest: "55 cm",
      length: "73 cm",
      shoulders: "48 cm",
      fit: "Classic British Skate Fit",
    },
    seller: {
      name: "London Stock Vault",
      verified: true,
      rating: 4.9,
      salesCount: 165,
      location: "Porto Alegre, RS",
    },
    weightKg: 0.3,
    featured: true,
  },
  {
    id: "prod-9",
    slug: "corteiz-alcatraz-heavy-sweatpants-black",
    brand: "Corteiz",
    name: "Alcatraz Heavy Cargo Sweatpants Black",
    gender: "Masculino",
    category: "Roupas",
    subcategory: "Calças",
    condition: "PRISTINE",
    conditionLabel: "Impecável / Sem Marcas",
    conditionNotes: "Peça de arquivo do drop de Londres. Estampa do logo da prisão de Alcatraz sem nenhuma rachadura.",
    price: 1850,
    size: "M",
    images: [
      "https://picsum.photos/800/1000?random=109",
      "https://picsum.photos/800/1000?random=209",
      "https://picsum.photos/800/1000?random=309",
    ],
    description:
      "Calça de moletom pesada da marca londrina de culto Corteiz (RTW). Modelagem ampla com bolsos cargo laterais utilitários, cordão espesso de ajuste na cintura e o logo icônico da ilha de Alcatraz estampado na coxa esquerda.",
    tag: "VANGUARDA",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0511",
      inspector: "H. Vance (Monolith Forensic Lab)",
      inspectionDate: "Jan/2026",
      overallGrade: "9.7/10 (Pristine)",
      details: {
        stitchPrecision: "Costuras de overloque reforçadas no entrepernas",
        labelHologram: "Tag interna Corteiz RTW com corte de alfaiataria",
        fabricDensity: "Moletom 420 GSM 100% algodão escovado",
        serialMatch: "Etiqueta lateral emborrachada 'Rules the World'",
      },
    },
    measurements: {
      length: "105 cm",
      fit: "Baggy Relaxed Streetwear Cut",
    },
    seller: {
      name: "LDN Underground Archive",
      verified: true,
      rating: 4.8,
      salesCount: 78,
      location: "São Paulo, SP",
    },
    weightKg: 0.85,
    featured: false,
  },
  {
    id: "prod-10",
    slug: "nike-dunk-low-sp-syracuse-orange-blaze",
    brand: "Nike",
    name: "Dunk Low SP Syracuse Orange Blaze",
    gender: "Masculino",
    category: "Sneakers",
    subcategory: "Nike",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    conditionNotes: "Deadstock na caixa original com tags Nike Brasil e papel de seda intacto.",
    price: 2190,
    size: "41 EU",
    images: [
      "https://picsum.photos/800/1000?random=110",
      "https://picsum.photos/800/1000?random=210",
      "https://picsum.photos/800/1000?random=310",
    ],
    description:
      "Originalmente lançado no lendário pack 'Be True To Your School' de 1985 em homenagem à Universidade de Syracuse. Construção de couro premium de flor integral nas cores Orange Blaze e White com amortecimento clássico de sola cupsole.",
    tag: "GRAIL",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0819",
      inspector: "A. Sato (Footwear Authenticator)",
      inspectionDate: "Fev/2026",
      overallGrade: "10/10 (Deadstock)",
      details: {
        stitchPrecision: "Costura de 6 pontos por polegada no calcanhar",
        labelHologram: "Swoosh com corte e espessura milimétricos sem rebarbas",
        fabricDensity: "Couro bovino macio com textura granulada natural",
        serialMatch: "Código de barras da caixa correspondente ao QR tag interno",
      },
    },
    measurements: {
      insole: "27.5 cm",
      fit: "True to Size",
    },
    seller: {
      name: "Monolith Curadoria Oficial",
      verified: true,
      rating: 5.0,
      salesCount: 312,
      location: "São Paulo, SP",
    },
    weightKg: 1.4,
    featured: false,
  },
  {
    id: "prod-11",
    slug: "prada-re-nylon-bucket-hat-enamel-triangle",
    brand: "Prada",
    name: "Re-Nylon Bucket Hat Enamel Triangle Logo",
    gender: "Masculino",
    category: "Acessórios",
    subcategory: "Buckets",
    condition: "PRISTINE",
    conditionLabel: "Impecável / Sem Marcas",
    conditionNotes: "Usado em uma única ocasião. O clássico triângulo esmaltado Prada está sem marcas de atrito.",
    price: 3400,
    originalRetailPrice: 4200,
    size: "M",
    images: [
      "https://picsum.photos/800/1000?random=111",
      "https://picsum.photos/800/1000?random=211",
      "https://picsum.photos/800/1000?random=311",
    ],
    description:
      "O icônico chapéu bucket da Maison Prada confeccionado em Re-Nylon regenerado a partir de resíduos oceânicos. Apresenta forro de algodão puro respirável e o lendário logotipo triangular em metal esmaltado aplicado lateralmente.",
    tag: "ICÔNICO",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0441",
      inspector: "K. Alencar (Accessories Authenticator)",
      inspectionDate: "Jan/2026",
      overallGrade: "9.9/10 (Pristine Luxury)",
      details: {
        stitchPrecision: "Pesponto circular contínuo na aba com espaçamento de 4mm",
        labelHologram: "Triângulo esmaltado com rebites traseiros achatados originais Prada",
        fabricDensity: "Nylon regenerado ECONYL impermeabilizado",
        serialMatch: "Certificado de autenticidade RFID Prada verificado por leitor",
      },
    },
    measurements: {
      fit: "Tamanho M (58 cm de circunferência)",
    },
    seller: {
      name: "Milano Luxury Vault",
      verified: true,
      rating: 5.0,
      salesCount: 114,
      location: "São Paulo, SP",
    },
    weightKg: 0.25,
    featured: false,
  },
  {
    id: "prod-12",
    slug: "salomon-xt-6-advanced-black-phantom",
    brand: "Salomon",
    name: "XT-6 Advanced Black Phantom Core",
    gender: "Masculino",
    category: "Sneakers",
    subcategory: "Balenciaga",
    condition: "DSWT",
    conditionLabel: "Novo com Tags (D.S.W.T)",
    conditionNotes: "Novo na caixa original com sistema Quicklace lacrado.",
    price: 1890,
    size: "42 EU",
    images: [
      "https://picsum.photos/800/1000?random=112",
      "https://picsum.photos/800/1000?random=212",
      "https://picsum.photos/800/1000?random=312",
    ],
    description:
      "Originalmente lançado em 2013 para atletas de ultramaratona em trilhas brutais e transformado em ícone gorpcore pelas passarelas urbanas. Equipado com chassi ACS (Agile Chassis System) e solado Mud Contagrip®.",
    tag: "VANGUARDA",
    forensicReport: {
      certificateId: "MNL-FRN-2026-0792",
      inspector: "A. Sato (Footwear Authenticator)",
      inspectionDate: "Fev/2026",
      overallGrade: "10/10 (Deadstock)",
      details: {
        stitchPrecision: "Filme TPU soldado sem excessos de cola",
        labelHologram: "Sistema Quicklace com trava original Salomon",
        fabricDensity: "Mesh de alta resistência à abrasão anti-detritos",
        serialMatch: "Etiqueta interna termoformada com código de fábrica Salomon",
      },
    },
    measurements: {
      insole: "28.0 cm",
      fit: "Snug Trail Fit (Recomendamos meia numeração acima se preferir folga)",
    },
    seller: {
      name: "Nordic Trail Archive",
      verified: true,
      rating: 4.9,
      salesCount: 82,
      location: "Florianópolis, SC",
    },
    weightKg: 1.35,
    featured: false,
  },
];

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export function getRelatedProducts(currentId: string, limit = 4): CatalogProduct[] {
  const current = CATALOG_PRODUCTS.find((p) => p.id === currentId);
  if (!current) return CATALOG_PRODUCTS.slice(0, limit);

  const sameCategoryOrBrand = CATALOG_PRODUCTS.filter(
    (p) => p.id !== currentId && (p.category === current.category || p.brand === current.brand)
  );

  if (sameCategoryOrBrand.length >= limit) {
    return sameCategoryOrBrand.slice(0, limit);
  }

  const fallback = CATALOG_PRODUCTS.filter((p) => p.id !== currentId);
  return fallback.slice(0, limit);
}
