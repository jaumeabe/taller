import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
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

    // Insert some default operarios if none exist
    const existing = await sql`SELECT COUNT(*) as count FROM operarios`;
    if (Number(existing[0].count) === 0) {
      await sql`
        INSERT INTO operarios (nombre) VALUES
        ('Operario 1'),
        ('Operario 2'),
        ('Operario 3')
      `;
    }

    return NextResponse.json({ message: "Base de datos configurada correctamente" });
  } catch (error) {
    console.error("Error setting up database:", error);
    return NextResponse.json(
      { error: "Error configurando la base de datos" },
      { status: 500 }
    );
  }
}
