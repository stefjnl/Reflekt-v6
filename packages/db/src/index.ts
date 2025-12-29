import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// In Next.js edge or regular runtime, DATABASE_URL should be provided by the framework's env loading.
// We avoid importing dotenv here to prevent 'fs' module errors in Edge Runtime.

if (!connectionString) {
    // This might log in build time if env is not present, which is typical for TS checks
    // but in runtime it should be there.
    // console.warn("DATABASE_URL is not set");
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
export * from "./schema";
