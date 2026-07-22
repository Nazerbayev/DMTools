import * as path from 'node:path'
import { promises as fs } from 'node:fs'
import { Kysely, SqliteDialect } from '@kysely/kysely'
import { FileMigrationProvider, Migrator } from '@kysely/kysely/migration'
import SQLite from "better-sqlite3";

async function migrateToLatest() {
  const dialect = new SqliteDialect({
    database: new SQLite("app.db"),
  });

  const db = new Kysely({ dialect });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(import.meta.dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
