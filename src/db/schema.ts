import { pgTable, uuid, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. SELLERS TABLE
export const sellers = pgTable("sellers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("5.00"),
  salesCount: integer("sales_count").default(0),
  location: text("location").default("São Paulo, SP"),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. PRODUCTS TABLE
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  gender: text("gender").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  condition: text("condition").notNull(),
  conditionLabel: text("condition_label").notNull(),
  conditionNotes: text("condition_notes").default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalRetailPrice: numeric("original_retail_price", { precision: 10, scale: 2 }),
  size: text("size").notNull(),
  weightKg: numeric("weight_kg", { precision: 5, scale: 2 }).default("0.50"),
  description: text("description").notNull(),
  tag: text("tag"), // "GRAIL" | "ICÔNICO" | "VANGUARDA" | "ESSENCIAL" | "PASSARELA" | "ARQUIVO"
  status: text("status").default("ACTIVE").notNull(), // "ACTIVE", "SOLD", "DRAFT", "ARCHIVED"
  sellerId: uuid("seller_id").references(() => sellers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. PRODUCT IMAGES TABLE
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  storageKey: text("storage_key").notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. FORENSIC REPORTS TABLE
export const forensicReports = pgTable("forensic_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .unique()
    .references(() => products.id, { onDelete: "cascade" }),
  certificateId: text("certificate_id").notNull(),
  inspector: text("inspector").default("ONYX DIGITAL FORENSICS").notNull(),
  inspectionDate: text("inspection_date").notNull(),
  overallGrade: text("overall_grade").default("A+").notNull(),
  stitchPrecision: text("stitch_precision").default("Conforme"),
  labelHologram: text("label_hologram").default("Autêntico"),
  fabricDensity: text("fabric_density").default("480 GSM"),
  serialMatch: text("serial_match").default("Verificado"),
  blockchainTxHash: text("blockchain_tx_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. PRODUCT MEASUREMENTS TABLE
export const productMeasurements = pgTable("product_measurements", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .unique()
    .references(() => products.id, { onDelete: "cascade" }),
  chest: text("chest"),
  length: text("length"),
  shoulders: text("shoulders"),
  insole: text("insole"),
  fit: text("fit").default("Regular / Fiel ao tamanho").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. MEDIA FILES TABLE (Serverless Persistent Media Storage)
export const mediaFiles = pgTable("media_files", {
  key: text("key").primaryKey(), // e.g. "1725628192-supreme-hoodie-abc.webp"
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  data: text("data").notNull(), // Base64 encoded media buffer
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RELATIONS DEFINITIONS
export const sellersRelations = relations(sellers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(sellers, {
    fields: [products.sellerId],
    references: [sellers.id],
  }),
  images: many(productImages),
  forensicReport: one(forensicReports, {
    fields: [products.id],
    references: [forensicReports.productId],
  }),
  measurements: one(productMeasurements, {
    fields: [products.id],
    references: [productMeasurements.productId],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const forensicReportsRelations = relations(forensicReports, ({ one }) => ({
  product: one(products, {
    fields: [forensicReports.productId],
    references: [products.id],
  }),
}));

export const productMeasurementsRelations = relations(productMeasurements, ({ one }) => ({
  product: one(products, {
    fields: [productMeasurements.productId],
    references: [products.id],
  }),
}));
