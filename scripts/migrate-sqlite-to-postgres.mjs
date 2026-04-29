import Database from "better-sqlite3";
import pg from "pg";

const { Client } = pg;

const SQLITE_PATH = process.env.SQLITE_PATH || "./dev.db";
const POSTGRES_URL = process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const TABLE_ORDER = [
  "SportSection",
  "Abonement",
  "Trainer",
  "BlogPost",
  "Department",
  "RentalItem",
  "Application",
  "AdminUser",
  "SeoData",
];

const quote = (name) => `"${String(name).replace(/"/g, '""')}"`;

function convertValue(value, pgType) {
  if (value === null || value === undefined) return null;
  if (pgType === "boolean") {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value === "true" || value === "1";
  }
  return value;
}

async function main() {
  const sqlite = new Database(SQLITE_PATH, { readonly: true });
  const pgClient = new Client({ connectionString: POSTGRES_URL });
  await pgClient.connect();

  try {
    const sqliteTables = sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
      )
      .all()
      .map((row) => row.name)
      .filter((name) => TABLE_ORDER.includes(name));

    const tables = TABLE_ORDER.filter((name) => sqliteTables.includes(name));

    for (const table of tables) {
      const pgColumnsRes = await pgClient.query(
        `
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `,
        [table],
      );

      if (pgColumnsRes.rowCount === 0) {
        console.warn(`Skip ${table}: table not found in PostgreSQL`);
        continue;
      }

      const pgTypesByColumn = new Map(
        pgColumnsRes.rows.map((r) => [r.column_name, r.data_type]),
      );

      const rows = sqlite.prepare(`SELECT * FROM ${quote(table)}`).all();
      const sqliteColumns = sqlite
        .prepare(`PRAGMA table_info(${quote(table)})`)
        .all()
        .map((c) => c.name)
        .filter((c) => pgTypesByColumn.has(c));

      if (sqliteColumns.length === 0) {
        console.warn(`Skip ${table}: no matching columns`);
        continue;
      }

      await pgClient.query(`TRUNCATE TABLE ${quote(table)} CASCADE`);

      if (rows.length === 0) {
        console.log(`${table}: 0 rows`);
        continue;
      }

      const columnsSql = sqliteColumns.map(quote).join(", ");
      const placeholders = sqliteColumns.map((_, i) => `$${i + 1}`).join(", ");
      const insertSql = `INSERT INTO ${quote(table)} (${columnsSql}) VALUES (${placeholders})`;

      await pgClient.query("BEGIN");
      try {
        for (const row of rows) {
          const values = sqliteColumns.map((c) =>
            convertValue(row[c], pgTypesByColumn.get(c)),
          );
          await pgClient.query(insertSql, values);
        }
        await pgClient.query("COMMIT");
      } catch (error) {
        await pgClient.query("ROLLBACK");
        throw error;
      }

      console.log(`${table}: ${rows.length} rows migrated`);
    }

    console.log("SQLite -> PostgreSQL migration completed.");
  } finally {
    await pgClient.end();
    sqlite.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

