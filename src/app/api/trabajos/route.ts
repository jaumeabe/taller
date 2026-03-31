import { getDb, ensureTablesExist } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await ensureTablesExist();
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const operarioId = searchParams.get("operario_id");

    let trabajos;
    if (operarioId) {
      trabajos = await sql`
        SELECT t.id, t.trabajo, t.codigo, t.vehiculo, t.tiempo, t.observaciones,
               t.created_at, o.nombre as operario
        FROM trabajos t
        JOIN operarios o ON t.operario_id = o.id
        WHERE t.operario_id = ${Number(operarioId)}
        ORDER BY t.created_at DESC
      `;
    } else {
      trabajos = await sql`
        SELECT t.id, t.trabajo, t.codigo, t.vehiculo, t.tiempo, t.observaciones,
               t.created_at, o.nombre as operario
        FROM trabajos t
        JOIN operarios o ON t.operario_id = o.id
        ORDER BY t.created_at DESC
      `;
    }

    return NextResponse.json(trabajos);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener trabajos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDb();
    const { operario_id, trabajo, codigo, vehiculo, tiempo, observaciones } =
      await request.json();

    if (!operario_id || !trabajo || !codigo || !vehiculo || !tiempo) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios (excepto observaciones)" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO trabajos (operario_id, trabajo, codigo, vehiculo, tiempo, observaciones)
      VALUES (${operario_id}, ${trabajo}, ${codigo}, ${vehiculo}, ${tiempo}, ${observaciones || ''})
      RETURNING id, trabajo, codigo, vehiculo, tiempo, observaciones, created_at
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al registrar trabajo" },
      { status: 500 }
    );
  }
}
