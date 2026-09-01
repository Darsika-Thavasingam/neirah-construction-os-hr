import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Seed command — ts-node runs the seed script directly
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
