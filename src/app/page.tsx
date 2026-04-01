"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface Operario {
  id: number;
  nombre: string;
}

interface Trabajo {
  id: number;
  trabajo: string;
  codigo: string;
  vehiculo: string;
  tiempo: string;
  observaciones: string;
  tiene_ayudante: boolean;
  ayudante: string;
  horas_ayudante: string;
  operario: string;
  created_at: string;
}

interface Tarea {
  codigo: string;
  trabajo: string;
  tiempo: number | string;
  categoria: string;
}

const TAREAS: Tarea[] = [
  // Reparación cubas y jaulas
  { codigo: "R001", trabajo: "Cambiar aceite hidraulico", tiempo: 8, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R002", trabajo: "Cambiar ballestas", tiempo: 6, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R003", trabajo: "Cambiar pastillas 1 eje", tiempo: 1.5, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R004", trabajo: "Cambiar discos 1 eje", tiempo: 8, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R005", trabajo: "Cambiar bombona suspension", tiempo: 1, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R006", trabajo: "Cambiar casquillos sin fin", tiempo: 6, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R007", trabajo: "Cambiar 1 casquillo arrastre", tiempo: 6, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R008", trabajo: "Cambiar motor hidraulico", tiempo: 1.5, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R009", trabajo: "Soldar puertas jaula", tiempo: 0, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R010", trabajo: "Cambiar casquillo 1 eje", tiempo: 4, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R011", trabajo: "Cambiar amortiguador", tiempo: 1, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R012", trabajo: "Cambiar sirga ventas jaula", tiempo: 4, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R013", trabajo: "Cambiar baterias jaula", tiempo: 1, categoria: "Reparacion cubas y jaulas" },
  { codigo: "R014", trabajo: "Varios en remolques", tiempo: "", categoria: "Reparacion cubas y jaulas" },
  // Reparación tractoras
  { codigo: "R015", trabajo: "Cambiar embrague", tiempo: 20, categoria: "Reparacion tractoras" },
  { codigo: "R016", trabajo: "Cambiar alternador", tiempo: 1.5, categoria: "Reparacion tractoras" },
  { codigo: "R017", trabajo: "Cambiar radiador motor", tiempo: 12, categoria: "Reparacion tractoras" },
  { codigo: "R018", trabajo: "Cambiar turbocompresor", tiempo: 4, categoria: "Reparacion tractoras" },
  { codigo: "R019", trabajo: "Cambiar bomba agua", tiempo: 5, categoria: "Reparacion tractoras" },
  { codigo: "R020", trabajo: "Cambiar ventilador", tiempo: 5, categoria: "Reparacion tractoras" },
  { codigo: "R021", trabajo: "Cambiar bomba combustible", tiempo: 3, categoria: "Reparacion tractoras" },
  { codigo: "R022", trabajo: "Cambiar 6 inyectores", tiempo: 16, categoria: "Reparacion tractoras" },
  { codigo: "R023", trabajo: "Cambiar correas", tiempo: 1.5, categoria: "Reparacion tractoras" },
  { codigo: "R024", trabajo: "Cambiar motor de arranque", tiempo: 1.5, categoria: "Reparacion tractoras" },
  { codigo: "R025", trabajo: "Cambiar pastillas en 1 eje", tiempo: 1.5, categoria: "Reparacion tractoras" },
  { codigo: "R026", trabajo: "Cambiar casquillos traseros", tiempo: 4, categoria: "Reparacion tractoras" },
  { codigo: "R027", trabajo: "Varios en tractoras", tiempo: "", categoria: "Reparacion tractoras" },
  // Reparación vehículo ligero
  { codigo: "R028", trabajo: "Cambiar neumaticos", tiempo: 1.5, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R029", trabajo: "Revision mantenimiento", tiempo: 1, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R030", trabajo: "Cambiar frenos", tiempo: 1.5, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R031", trabajo: "Cambiar embrague", tiempo: 8, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R032", trabajo: "Carga aire acondicionado", tiempo: 1, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R033", trabajo: "Cambiar amortiguador delantero", tiempo: 2, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R034", trabajo: "Revisar fallos electricos", tiempo: 0, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R035", trabajo: "Cambiar amortiguador trasero", tiempo: 1, categoria: "Reparacion vehiculo ligero" },
  { codigo: "R036", trabajo: "Varios ligeros", tiempo: 0, categoria: "Reparacion vehiculo ligero" },
  // Urgencias
  { codigo: "RE040", trabajo: "SALIDA URGENCIA", tiempo: "", categoria: "Urgencias" },
];

const CATEGORIAS = [...new Set(TAREAS.map((t) => t.categoria))];

const AYUDANTES = ["GREGOR UIBO", "MOHAMED KESSARI"];

export default function Home() {
  const [operarios, setOperarios] = useState<Operario[]>([]);
  const [selectedOperario, setSelectedOperario] = useState<string>("");
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fechaHoy = useMemo(() => {
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  const [selectedTarea, setSelectedTarea] = useState<string>("");
  const [tieneAyudante, setTieneAyudante] = useState(false);
  const [form, setForm] = useState({
    trabajo: "",
    codigo: "",
    vehiculo: "",
    tiempo: "",
    observaciones: "",
    ayudante: "",
    horas_ayudante: "",
  });

  useEffect(() => {
    fetch("/api/operarios")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOperarios(data);
      })
      .catch(() => {});
  }, []);

  const loadTrabajos = useCallback(() => {
    const url = selectedOperario
      ? `/api/trabajos?operario_id=${selectedOperario}`
      : "/api/trabajos";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTrabajos(data);
      })
      .catch(() => {});
  }, [selectedOperario]);

  useEffect(() => {
    loadTrabajos();
  }, [loadTrabajos]);

  const exportarExcel = () => {
    if (trabajos.length === 0) return;
    const headers = ["Fecha", "Matrícula", "Operario", "Horas", "Ayudante", "Horas Ayudante", "Trabajo", "Observación"];
    const rows = trabajos.map((t) => [
      new Date(t.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      t.vehiculo,
      t.operario,
      t.tiempo,
      t.tiene_ayudante ? t.ayudante : "",
      t.tiene_ayudante ? t.horas_ayudante : "",
      t.trabajo,
      t.observaciones,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trabajos_taller_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este trabajo?")) return;
    try {
      const res = await fetch(`/api/trabajos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadTrabajos();
      }
    } catch {}
  };

  const handleTareaChange = (codigo: string) => {
    setSelectedTarea(codigo);
    const tarea = TAREAS.find((t) => t.codigo === codigo);
    if (tarea) {
      setForm({
        ...form,
        trabajo: tarea.trabajo,
        codigo: tarea.codigo,
        tiempo: tarea.tiempo !== "" ? `${tarea.tiempo}h` : "",
      });
    } else {
      setForm({ ...form, trabajo: "", codigo: "", tiempo: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperario) {
      setMessage({ text: "Selecciona un operario", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/trabajos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operario_id: Number(selectedOperario),
          trabajo: form.trabajo,
          codigo: form.codigo,
          vehiculo: form.vehiculo,
          tiempo: form.tiempo,
          observaciones: form.observaciones,
          tiene_ayudante: tieneAyudante,
          ayudante: tieneAyudante ? form.ayudante : "",
          horas_ayudante: tieneAyudante ? form.horas_ayudante : "",
        }),
      });

      if (res.ok) {
        setForm({ trabajo: "", codigo: "", vehiculo: "", tiempo: "", observaciones: "", ayudante: "", horas_ayudante: "" });
        setSelectedTarea("");
        setTieneAyudante(false);
        setMessage({ text: "Trabajo registrado correctamente", type: "success" });
        loadTrabajos();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Error al registrar", type: "error" });
      }
    } catch {
      setMessage({ text: "Error de conexión", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Taller - Registro de Trabajos
        </h1>
        <p className="text-sm text-gray-500 mt-1 sm:mt-0 capitalize">{fechaHoy}</p>
      </div>

      {/* Selector de Operario */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Oficial
        </label>
        <select
          value={selectedOperario}
          onChange={(e) => setSelectedOperario(e.target.value)}
          className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-3 sm:py-2 text-base sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seleccionar oficial --</option>
          {operarios.map((op) => (
            <option key={op.id} value={op.id}>
              {op.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario */}
      {selectedOperario && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Registrar trabajo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Trabajo
              </label>
              <select
                value={selectedTarea}
                onChange={(e) => handleTareaChange(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Seleccionar trabajo --</option>
                {CATEGORIAS.map((cat) => (
                  <optgroup key={cat} label={cat}>
                    {TAREAS.filter((t) => t.categoria === cat).map((t) => (
                      <option key={t.codigo} value={t.codigo}>
                        {t.codigo} - {t.trabajo}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Código
              </label>
              <input
                type="text"
                readOnly
                value={form.codigo}
                className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tiempo estimado
              </label>
              <input
                type="text"
                readOnly
                value={form.tiempo}
                className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Vehículo
              </label>
              <input
                type="text"
                required
                value={form.vehiculo}
                onChange={(e) => setForm({ ...form, vehiculo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Matrícula o modelo del vehículo"
              />
            </div>
          </div>

          {/* Ayudante */}
          <div className="mb-4 p-3 border border-gray-200 rounded-md">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tieneAyudante}
                onChange={(e) => {
                  setTieneAyudante(e.target.checked);
                  if (!e.target.checked) {
                    setForm({ ...form, ayudante: "", horas_ayudante: "" });
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Con ayudante</span>
            </label>

            {tieneAyudante && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Ayudante
                  </label>
                  <select
                    value={form.ayudante}
                    onChange={(e) => setForm({ ...form, ayudante: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Seleccionar ayudante --</option>
                    {AYUDANTES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Horas del ayudante
                  </label>
                  <input
                    type="text"
                    required
                    value={form.horas_ayudante}
                    onChange={(e) => setForm({ ...form, horas_ayudante: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 4h"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Observaciones
            </label>
            <textarea
              value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Observaciones adicionales (opcional)"
            />
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Registrando..." : "Registrar trabajo"}
          </button>
        </form>
      )}

      {/* Tabla de trabajos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            Trabajos registrados
            {selectedOperario && operarios.find((o) => o.id === Number(selectedOperario))
              ? ` - ${operarios.find((o) => o.id === Number(selectedOperario))!.nombre}`
              : " - Todos"}
          </h2>
          {trabajos.length > 0 && (
            <button
              onClick={exportarExcel}
              className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Exportar Excel
            </button>
          )}
        </div>

        {trabajos.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No hay trabajos registrados</p>
        ) : (
          <>
            {/* Vista móvil: tarjetas */}
            <div className="block sm:hidden divide-y divide-gray-100">
              {trabajos.map((t) => (
                <div key={t.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{t.trabajo}</p>
                      <p className="text-xs text-gray-500">{t.codigo} - {t.operario}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium ml-2 shrink-0"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">Vehículo: </span>
                      <span className="text-gray-800">{t.vehiculo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tiempo: </span>
                      <span className="text-gray-800">{t.tiempo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ayudante: </span>
                      <span className="text-gray-800">
                        {t.tiene_ayudante ? `${t.ayudante} (${t.horas_ayudante})` : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha: </span>
                      <span className="text-gray-800">
                        {new Date(t.created_at).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  {t.observaciones && (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="text-gray-400">Obs: </span>{t.observaciones}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Vista desktop: tabla */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Operario</th>
                    <th className="text-left px-4 py-3">Trabajo</th>
                    <th className="text-left px-4 py-3">Código</th>
                    <th className="text-left px-4 py-3">Vehículo</th>
                    <th className="text-left px-4 py-3">Tiempo</th>
                    <th className="text-left px-4 py-3">Ayudante</th>
                    <th className="text-left px-4 py-3">Observaciones</th>
                    <th className="text-left px-4 py-3">Fecha</th>
                    <th className="text-left px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trabajos.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{t.operario}</td>
                      <td className="px-4 py-3">{t.trabajo}</td>
                      <td className="px-4 py-3">{t.codigo}</td>
                      <td className="px-4 py-3">{t.vehiculo}</td>
                      <td className="px-4 py-3">{t.tiempo}</td>
                      <td className="px-4 py-3">
                        {t.tiene_ayudante ? `${t.ayudante} (${t.horas_ayudante})` : "No"}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">{t.observaciones}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
