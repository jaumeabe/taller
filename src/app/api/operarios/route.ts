import { getDb, ensureTablesExist } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensureTablesExist();
    const sql = getDb();
    const operarios = await sql`SELECT id, nombre FROM operarios ORDER BY nombre`;
    return NextResponse.json(operarios);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener operarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDb();
    const { nombre } = await request.json();

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return NextResponse.json(
        { error: "El nombre del operario es obligatorio" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO operarios (nombre) VALUES (${nombre.trim()})
      RETURNING id, nombre
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear operario" },
      { status: 500 }
    );
  }
}
