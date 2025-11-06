import { useState, useEffect } from "react";
import { obtenerCitasCompletadas, obtenerCitasCanceladas } from "../Services/CitasService";

interface CitaCompletada {
  idCita: number;
  nombre: string;
  telefono: string;
  barbero: string;
  fecha: string;
  hora: string;
  fechaCompletada: string;
  servicios: string[];
  precioTotal: number;
}

interface CitaCancelada {
  idCita: number;
  nombre: string;
  telefono: string;
  barbero: string;
  fecha: string;
  hora: string;
  fechaCancelada: string;
  motivoCancelacion: string;
}

function HistorialCitas() {
  const [citasCompletadas, setCitasCompletadas] = useState<CitaCompletada[]>([]);
  const [citasCanceladas, setCitasCanceladas] = useState<CitaCancelada[]>([]);
  const [vistaActual, setVistaActual] = useState<"completadas" | "canceladas">("completadas");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const [completadas, canceladas] = await Promise.all([
        obtenerCitasCompletadas(),
        obtenerCitasCanceladas(),
      ]);
      setCitasCompletadas(completadas);
      setCitasCanceladas(canceladas);
      console.log("Completadas:", completadas);
      console.log("Canceladas:", canceladas);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return "N/A";
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return fechaISO;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Historial de Citas</h1>
        <button
          onClick={cargarHistorial}
          className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded"
        >
           Actualizar
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setVistaActual("completadas")}
          className={`px-6 py-2 rounded-t-lg font-medium ${
            vistaActual === "completadas"
              ? "bg-green-500 text-black"
              : "bg-gray-200 text-black -700 hover:bg-black-300"
          }`}
        >
           Completadas ({citasCompletadas.length})
        </button>
        <button
          onClick={() => setVistaActual("canceladas")}
          className={`px-6 py-2 rounded-t-lg font-medium ${
            vistaActual === "canceladas"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
           Canceladas ({citasCanceladas.length})
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-8">Cargando...</div>
      ) : (
        <>
          {vistaActual === "completadas" && (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full table-auto">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">Teléfono</th>
                    <th className="px-4 py-3 text-left">Barbero</th>
                    <th className="px-4 py-3 text-left">Fecha Agendada</th>
                    <th className="px-4 py-3 text-left">Hora</th>
                    <th className="px-4 py-3 text-left">Servicios</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-left">Completada el</th>
                  </tr>
                </thead>
                <tbody>
                  {citasCompletadas.map((cita) => (
                    <tr key={cita.idCita} className="border-b hover:bg-green-50">
                      <td className="px-4 py-3">{cita.nombre}</td>
                      <td className="px-4 py-3">{cita.telefono}</td>
                      <td className="px-4 py-3 font-medium text-blue-600">{cita.barbero}</td>
                      <td className="px-4 py-3">{cita.fecha}</td>
                      <td className="px-4 py-3">{cita.hora}</td>
                      <td className="px-4 py-3">
                        {cita.servicios.length > 0
                          ? cita.servicios.join(", ")
                          : "Sin servicios"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-green-600">
                        ${cita.precioTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatearFecha(cita.fechaCompletada)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {citasCompletadas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay citas completadas
                </div>
              )}
            </div>
          )}

          {vistaActual === "canceladas" && (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full table-auto">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">Teléfono</th>
                    <th className="px-4 py-3 text-left">Barbero</th>
                    <th className="px-4 py-3 text-left">Fecha Agendada</th>
                    <th className="px-4 py-3 text-left">Hora</th>
                    <th className="px-4 py-3 text-left">Motivo Cancelación</th>
                    <th className="px-4 py-3 text-left">Cancelada el</th>
                  </tr>
                </thead>
                <tbody>
                  {citasCanceladas.map((cita) => (
                    <tr key={cita.idCita} className="border-b hover:bg-red-50">
                      <td className="px-4 py-3">{cita.nombre}</td>
                      <td className="px-4 py-3">{cita.telefono}</td>
                      <td className="px-4 py-3 font-medium text-blue-600">{cita.barbero}</td>
                      <td className="px-4 py-3">{cita.fecha}</td>
                      <td className="px-4 py-3">{cita.hora}</td>
                      <td className="px-4 py-3 text-red-600 italic">
                        {cita.motivoCancelacion}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatearFecha(cita.fechaCancelada)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {citasCanceladas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay citas canceladas
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HistorialCitas;