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
      tiene_ayudante BOOLEAN DEFAULT FALSE,
      ayudante VARCHAR(100) DEFAULT '',
      horas_ayudante VARCHAR(50) DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Reset operarios with current team
  await sql`TRUNCATE TABLE operarios CASCADE`;
  await sql`
    INSERT INTO operarios (nombre) VALUES
    ('COSMIN VERES ANDREAS'),
    ('DENIS RAZVAN VERES'),
    ('PEETER UIBO'),
    ('RICARDO MARTOS'),
    ('SERGI JOSEP PINEDA')
  `;

  // Add new columns if they don't exist (safe to run multiple times)
  await sql`ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS tiene_ayudante BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS ayudante VARCHAR(100) DEFAULT ''`;
  await sql`ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS horas_ayudante VARCHAR(50) DEFAULT ''`;

  initialized = true;
}
