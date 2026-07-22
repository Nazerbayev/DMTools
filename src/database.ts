import { Kysely, SqliteDialect } from "@kysely/kysely";
import SQLite from "better-sqlite3";
import type { Database } from './types.ts'

const dialect = new SqliteDialect({
  database: new SQLite("app.db"),
});

export const db = new Kysely<Database>({ dialect });
