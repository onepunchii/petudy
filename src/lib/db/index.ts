import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let database: PostgresJsDatabase<typeof schema> | null = null;

function createDb() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("Missing DATABASE_URL environment variable");
    }

    // Disable prefetch as it is not supported for "Transaction" pool mode
    const client = postgres(connectionString, { prepare: false });
    return drizzle(client, { schema });
}

export function getDb() {
    if (!database) {
        database = createDb();
    }

    return database;
}

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
    get(_target, prop, receiver) {
        return Reflect.get(getDb() as object, prop, receiver);
    },
});
