import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_HyG9a8FxUljm@ep-empty-scene-ackp4tg2.sa-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
