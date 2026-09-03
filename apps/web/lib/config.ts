/**
 * Neirah Construction OS – HR Module
 * Central frontend configuration
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

/** Matches DEMO_TENANT_ID in prisma/seed.ts */
export const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ?? '7639f389-470e-4df2-b96d-71a34e46717c';

/** Shared project UUID for employee project assignments */
export const DEFAULT_PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID ?? '22222222-2222-4222-8222-222222222222';
