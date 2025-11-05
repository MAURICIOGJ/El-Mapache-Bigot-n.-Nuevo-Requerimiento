import { useState, useEffect } from "react";
import {
  obtenerCitasProgramadas,
  obtenerServicios,
  obtenerBarberos,
  crearCita,
  actualizarCita,
  completarCita,
  cancelarCita,
} from "../Services/CitasService";

interface Servicio {
  idServicio: number;
  descripcion: string;
  costo: number;
}

interface Barbero {
  idUsuario: number;
  nombre: string;
}

interface Cita {
  idCita: number;
  nombre: string;
  telefono: string;
  barbero: string;
  fecha: string;
  hora: string;
  servicios: string[];
  precios: number[];
  precioTotal: number;
  idCliente: number;
  idUsuario: number;
}

function CitasProgramadas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState<Servicio[]>([]);
  const [barberosDisponibles, setBarberosDisponibles] = useState<Barbero[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<number>(0);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);

  const [citaIdActual, setCitaIdActual] = useState<number | null>(null);
  const [clienteIdActual, setClienteIdActual] = useState<number | null>(null);
  const [citaAEliminar, setCitaAEliminar] = useState<number | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [citasData, serviciosData, barberosData] = await Promise.all([
        obtenerCitasProgramadas(),
        obtenerServicios(),
        obtenerBarberos(),
      ]);
      setCitas(citasData);
      setServiciosDisponibles(serviciosData);
      setBarberosDisponibles(barberosData);
      console.log("📊 Datos cargados");
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setTelefono("");
    setFecha("");
    setHora("");
    setBarberoSeleccionado(0);
    setServiciosSeleccionados([]);
    setCitaIdActual(null);
    setClienteIdActual(null);
  };

  const abrirModalNuevo = () => {
    limpiarFormulario();
    setModoEdicion(false);
    setMostrarModal(true);
  };

  const abrirModalEditar = (cita: Cita) => {
    setNombre(cita.nombre);
    setTelefono(cita.telefono);
    setFecha(cita.fecha);
    setHora(cita.hora);
    setBarberoSeleccionado(cita.idUsuario);
    setCitaIdActual(cita.idCita);
    setClienteIdActual(cita.idCliente);
    setServiciosSeleccionados([]);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    limpiarFormulario();
  };

  const handleServicioToggle = (idServicio: number) => {
    setServiciosSeleccionados((prev) =>
      prev.includes(idServicio)
        ? prev.filter((id) => id !== idServicio)
        : [...prev, idServicio]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !telefono.trim() || !fecha || !hora) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!barberoSeleccionado || barberoSeleccionado === 0) {
      alert("Por favor selecciona un barbero");
      return;
    }

    try {
      if (modoEdicion && citaIdActual && clienteIdActual) {
        await actualizarCita(
          citaIdActual,
          fecha,
          hora,
          clienteIdActual,
          barberoSeleccionado,
          serviciosSeleccionados,
          nombre,
          telefono
        );
        alert("✅ Cita actualizada exitosamente");
      } else {
        const clienteData = { nombre: nombre.trim(), telefono: telefono.trim() };
        const citaData = { fecha, hora };

        await crearCita(clienteData, citaData, barberoSeleccionado, serviciosSeleccionados);
        alert("✅ Cita creada exitosamente");
      }

      cerrarModal();
      await cargarDatos();
    } catch (error: any) {
      console.error("Error en handleSubmit:", error);

      let mensajeError = "❌ Error al guardar la cita.\n";

      if (error.response?.status === 500) {
        mensajeError += "Error del servidor. Verifica que:\n";
        mensajeError += "1. El barbero existe en la BD\n";
        mensajeError += "2. El teléfono no esté duplicado\n";
        mensajeError += "3. Has ejecutado el SQL de historial";
      } else if (error.response?.status === 400) {
        mensajeError += "Datos incompletos.";
      } else if (error.response?.data) {
        mensajeError += JSON.stringify(error.response.data);
      }

      alert(mensajeError);
    }
  };

  const abrirModalEliminar = (idCita: number) => {
    setCitaAEliminar(idCita);
    setMotivoCancelacion("");
    setMostrarModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setMostrarModalEliminar(false);
    setCitaAEliminar(null);
    setMotivoCancelacion("");
  };

  const handleCompletarCita = async () => {
    if (!citaAEliminar) return;

    try {
      await completarCita(citaAEliminar);
      alert("✅ Cita marcada como completada");
      cerrarModalEliminar();
      await cargarDatos();
    } catch (error) {
      console.error("Error completando cita:", error);
      alert("❌ Error al completar la cita");
    }
  };

  const handleCancelarCita = async () => {
    if (!citaAEliminar) return;

    if (!motivoCancelacion.trim()) {
      alert("Por favor ingresa el motivo de cancelación");
      return;
    }

    try {
      await cancelarCita(citaAEliminar, motivoCancelacion.trim());
      alert("✅ Cita cancelada");
      cerrarModalEliminar();
      await cargarDatos();
    } catch (error) {
      console.error("Error cancelando cita:", error);
      alert("❌ Error al cancelar la cita");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Citas Programadas</h1>
        <button
          onClick={abrirModalNuevo}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          + Nueva Cita
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-left">Barbero</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Hora</th>
              <th className="px-4 py-3 text-left">Servicios</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.idCita} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{cita.nombre}</td>
                <td className="px-4 py-3">{cita.telefono}</td>
                <td className="px-4 py-3 font-medium text-blue-600">{cita.barbero}</td>
                <td className="px-4 py-3">{cita.fecha}</td>
                <td className="px-4 py-3">{cita.hora}</td>
                <td className="px-4 py-3">
                  {cita.servicios.length > 0 ? cita.servicios.join(", ") : "Sin servicios"}
                </td>
                <td className="px-4 py-3 text-right">${cita.precioTotal.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => abrirModalEditar(cita)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => abrirModalEliminar(cita.idCita)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {citas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay citas programadas
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {modoEdicion ? "Editar Cita" : "Nueva Cita"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Barbero *</label>
                <select
                  required
                  value={barberoSeleccionado}
                  onChange={(e) => setBarberoSeleccionado(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value={0}>-- Selecciona un barbero --</option>
                  {barberosDisponibles.map((barbero) => (
                    <option key={barbero.idUsuario} value={barbero.idUsuario}>
                      {barbero.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora *</label>
                  <input
                    type="time"
                    required
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Servicios (Opcional)</label>
                <div className="border rounded p-3 max-h-48 overflow-y-auto">
                  {serviciosDisponibles.map((servicio) => (
                    <div key={servicio.idServicio} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`servicio-${servicio.idServicio}`}
                        checked={serviciosSeleccionados.includes(servicio.idServicio)}
                        onChange={() => handleServicioToggle(servicio.idServicio)}
                        className="mr-3"
                      />
                      <label htmlFor={`servicio-${servicio.idServicio}`} className="flex-1 cursor-pointer">
                        {servicio.descripcion} - ${servicio.costo.toFixed(2)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={cerrarModal} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  {modoEdicion ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">¿Qué hacer con esta cita?</h2>

            <div className="space-y-4">
              <button
                onClick={handleCompletarCita}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium"
              >
                ✅ Marcar como Completada
              </button>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">O cancelar con motivo:</p>
                <textarea
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Escribe el motivo..."
                  className="w-full border rounded px-3 py-2 mb-2"
                  rows={3}
                />
                <button
                  onClick={handleCancelarCita}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  ❌ Cancelar con Motivo
                </button>
              </div>

              <button onClick={cerrarModalEliminar} className="w-full bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg">
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitasProgramadas;