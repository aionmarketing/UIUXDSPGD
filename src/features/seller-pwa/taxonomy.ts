// Taxonomy definitions according to .context/taxonomy-wireframes.md

export const TAXONOMY_GENDERS = [
  "Masculino",
  "Feminino",
] as const;

export type TaxonomyGender = (typeof TAXONOMY_GENDERS)[number];

export const TAXONOMY_BRANDS = [
  "Supreme",
  "Palace",
  "Bape",
  "Stüssy",
  "Corteiz",
  "Nike",
  "Adidas",
  "The north face",
  "Arc’teryx",
  "Salomon",
  "Off-white",
  "Palm Angels",
  "Gucci",
  "Louis Vuitton",
  "Prada",
  "Burberry",
  "Dior",
  "Versace",
  "Lanvin",
  "Balenciaga",
  "Botega Venetta",
  "Givenchy",
  "Outras",
] as const;

export type TaxonomyBrand = (typeof TAXONOMY_BRANDS)[number];

export const TAXONOMY_CATEGORIES = [
  "Roupas",
  "Sneakers",
  "Acessórios",
] as const;

export type TaxonomyCategory = (typeof TAXONOMY_CATEGORIES)[number];

export const TAXONOMY_SUBCATEGORIES: Record<TaxonomyCategory, readonly string[]> = {
  Roupas: [
    "Regatas",
    "Camisetas",
    "Bermudas",
    "Fleece",
    "Moletom",
    "Jaquetas",
    "Calças",
  ],
  Sneakers: [
    "Nike",
    "Adidas",
    "Balenciaga",
    "Lanvin",
    "Louis Vuitton",
  ],
  Acessórios: [
    "Bones",
    "Buckets",
    "Gorros",
    "Balaclavas",
    "Luvas",
    "Meias",
    "Cuecas",
    "Outros",
  ],
};

export const CONDITIONS = [
  {
    value: "DSWT",
    label: "Novo com Tags (D.S.W.T)",
    description: "Nunca usado, embalagem ou etiquetas originais intactas.",
  },
  {
    value: "PRISTINE",
    label: "Impecável / Sem Marcas",
    description: "Sem marcas visíveis de desgaste ou uso.",
  },
  {
    value: "GENTLY_USED",
    label: "Usado em Bom Estado",
    description: "Pouco uso, sem avarias estruturais ou manchas.",
  },
  {
    value: "VINTAGE",
    label: "Vintage / Marcas de Uso",
    description: "Desgaste natural ou estética vintage preservada.",
  },
] as const;

export const PACKAGE_PRESETS = [
  {
    id: "P",
    label: "Pacote P (até 0.5kg)",
    description: "Acessórios, Camisetas, Bermudas",
    defaultWeight: "0.4",
  },
  {
    id: "M",
    label: "Pacote M (0.5kg a 1.2kg)",
    description: "Fleece, Moletons, Calças",
    defaultWeight: "0.9",
  },
  {
    id: "G",
    label: "Pacote G (1.2kg a 2.5kg)",
    description: "Sneakers na caixa, Jaquetas pesadas",
    defaultWeight: "1.8",
  },
  {
    id: "CUSTOM",
    label: "Personalizado / Outro",
    description: "Especificar peso e medidas",
    defaultWeight: "",
  },
] as const;
