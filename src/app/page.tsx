"use client";

import { useState, useEffect, useCallback } from "react";

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
  operario: string;
  created_at: string;
}

export default function Home() {
  const [operarios, setOperarios] = useState<Operario[]>([]);
  const [selectedOperario, setSelectedOperario] = useState<string>("");
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    trabajo: "",
    codigo: "",
    vehiculo: "",
    tiempo: "",
    observaciones: "",
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
          ...form,
        }),
      });

      if (res.ok) {
        setForm({ trabajo: "", codigo: "", vehiculo: "", tiempo: "", observaciones: "" });
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Taller - Registro de Trabajos
      </h1>

      {/* Selector de Operario */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Operario
        </label>
        <select
          value={selectedOperario}
          onChange={(e) => setSelectedOperario(e.target.value)}
          className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seleccionar operario --</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Trabajo
              </label>
              <input
                type="text"
                required
                value={form.trabajo}
                onChange={(e) => setForm({ ...form, trabajo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del trabajo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Código
              </label>
              <input
                type="text"
                required
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Código del trabajo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Vehículo
              </label>
              <input
                type="text"
                required
                value={form.vehiculo}
                onChange={(e) => setForm({ ...form, vehiculo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Matrícula o modelo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tiempo
              </label>
              <input
                type="text"
                required
                value={form.tiempo}
                onChange={(e) => setForm({ ...form, tiempo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 2h 30min"
              />
            </div>
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
        <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">
          Trabajos registrados
          {selectedOperario && operarios.find((o) => o.id === Number(selectedOperario))
            ? ` - ${operarios.find((o) => o.id === Number(selectedOperario))!.nombre}`
            : " - Todos"}
        </h2>

        {trabajos.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No hay trabajos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Operario</th>
                  <th className="text-left px-4 py-3">Trabajo</th>
                  <th className="text-left px-4 py-3">Código</th>
                  <th className="text-left px-4 py-3">Vehículo</th>
                  <th className="text-left px-4 py-3">Tiempo</th>
                  <th className="text-left px-4 py-3">Observaciones</th>
                  <th className="text-left px-4 py-3">Fecha</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
