import * as path from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Kysely, SqliteDialect } from '@kysely/kysely'
import { FileMigrationProvider, Migrator } from '@kysely/kysely/migration'
import SQLite from "better-sqlite3";

import type { Database } from './types.ts'


async function migrateToLatest() {
  const migrationFolder = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'migrations',
  )

  const dialect = new SqliteDialect({
    database: new SQLite("app.db"),
  });

  const db = new Kysely<Database>({ dialect });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      import: (modulePath) => import(pathToFileURL(modulePath).href),
      // This needs to be an absolute path.
      migrationFolder,
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
