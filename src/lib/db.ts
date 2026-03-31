import { neon } from "@neondatabase/serverless";

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(process.env.DATABASE_URL);
}

let initialized = false;

export async function ensureTablesExist() {
  if (initialized) return;

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS operarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS trabajos (
      id SERIAL PRIMARY KEY,
      operario_id INTEGER REFERENCES operarios(id),
      trabajo VARCHAR(255) NOT NULL,
      codigo VARCHAR(100) NOT NULL,
      vehiculo VARCHAR(255) NOT NULL,
      tiempo VARCHAR(100) NOT NULL,
      observaciones TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const existing = await sql`SELECT COUNT(*) as count FROM operarios`;
  if (Number(existing[0].count) === 0) {
    await sql`
      INSERT INTO operarios (nombre) VALUES
      ('Operario 1'),
      ('Operario 2'),
      ('Operario 3')
    `;
  }

  initialized = true;
}
