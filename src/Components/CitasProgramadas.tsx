import { useState, useEffect } from "react";
import {
  obtenerCitasProgramadas,
  obtenerServicios,
  crearCita,
  actualizarCita,
  eliminarCita,
} from "../Services/CitasService";

interface Servicio {
  idServicio: number;
  descripcion: string;
  costo: number;
}

interface Cita {
  idCita: number;
  nombre: string;
  telefono: string;
  fecha: string;
  hora: string;
  servicios: string[];
  precios: number[];
  precioTotal: number;
  idCliente: number;
}

function CitasProgramadas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState<Servicio[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);

  const [citaIdActual, setCitaIdActual] = useState<number | null>(null);
  const [clienteIdActual, setClienteIdActual] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [citasData, serviciosData] = await Promise.all([
        obtenerCitasProgramadas(),
        obtenerServicios(),
      ]);
      setCitas(citasData);
      setServiciosDisponibles(serviciosData);
      console.log("Datos cargados - Citas:", citasData.length, "Servicios:", serviciosData.length);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setTelefono("");
    setFecha("");
    setHora("");
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

    try {
      if (modoEdicion && citaIdActual && clienteIdActual) {
        await actualizarCita(
          citaIdActual,
          fecha,
          hora,
          clienteIdActual,
          serviciosSeleccionados,
          nombre,
          telefono
        );
        alert("Cita actualizada exitosamente");
      } else {
        const clienteData = {
          nombre: nombre.trim(),
          telefono: telefono.trim(),
        };

        const citaData = {
          fecha: fecha,
          hora: hora,
        };

        await crearCita(clienteData, citaData, serviciosSeleccionados);
        alert("Cita creada exitosamente");
      }

      cerrarModal();
      await cargarDatos();
    } catch (error: any) {
      console.error("Error en handleSubmit:", error);

      let mensaje = "Error al guardar la cita. ";
      if (error.response?.status) {
        mensaje += `Codigo: ${error.response.status}. `;
      }
      if (error.response?.data) {
        mensaje += `Detalles: ${JSON.stringify(error.response.data)}`;
      }
      alert(mensaje);
    }
  };

  const handleEliminar = async (idCita: number) => {
    if (window.confirm("Estas seguro de eliminar esta cita?")) {
      try {
        await eliminarCita(idCita);
        alert("Cita eliminada exitosamente");
        await cargarDatos();
      } catch (error) {
        console.error("Error eliminando cita:", error);
        alert("Error al eliminar la cita");
      }
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
              <th className="px-4 py-3 text-left">Telefono</th>
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
                    onClick={() => handleEliminar(cita.idCita)}
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
                  <label className="block text-sm font-medium mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Juan Perez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="4611234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hora</label>
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
                <label className="block text-sm font-medium mb-2">
                  Seleccionar Servicios
                </label>
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
                      <label
                        htmlFor={`servicio-${servicio.idServicio}`}
                        className="flex-1 cursor-pointer"
                      >
                        {servicio.descripcion} - ${servicio.costo.toFixed(2)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {modoEdicion ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitasProgramadas;