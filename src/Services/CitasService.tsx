import axios from "axios";

const API_CLIENTE = "http://localhost:8080/cliente";
const API_SERVICIO = "http://localhost:8080/servicio";
const API_CITA = "http://localhost:8080/cita"; 

export const obtenerCitasProgramadas = async () => {
  try {
    const [clientesRes, serviciosRes] = await Promise.all([
      axios.get(API_CLIENTE),
      axios.get(API_SERVICIO)
    ]);

    const clientes = clientesRes.data;
    const servicios = serviciosRes.data;

    const citasProgramadas = clientes.flatMap((cliente: any) =>
      cliente.cita.map((cita: any) => {
        const idsCitaServicios = cita.citaServicios.map((cs: any) => cs.idCitaServicio);
        const serviciosDeLaCita = servicios.filter((s: any) =>
          s.citaServicios.some((cs: any) => idsCitaServicios.includes(cs.idCitaServicio))
        );

        return {
          idCita: cita.idCita,
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          fecha: cita.fecha,
          hora: cita.hora,
          servicios: serviciosDeLaCita.map((s: any) => s.descripcion), // array de strings
          precios: serviciosDeLaCita.map((s: any) => s.costo),          // array de números
          precioTotal: serviciosDeLaCita.reduce((acc: number, s: any) => acc + s.costo, 0)

        };
      })
    );

    return citasProgramadas;
  } catch (error) {
    console.error("Error obteniendo citas programadas:", error);
    throw error;
  }
};

// Crear nueva cita
export const crearCita = async (clienteData: any, citaData: any) => {
  try {
    // primero crear cliente
    const resCliente = await axios.post(API_CLIENTE, clienteData);
    const clienteCreado = resCliente.data;

    // luego crear cita asociada al cliente
    const citaConCliente = {
      ...citaData,
      cliente: { idCliente: clienteCreado.idCliente },
    };

    const resCita = await axios.post(API_CITA, citaConCliente);
    console.log("Cita creada:", resCita.data);
  } catch (error) {
    console.error("Error al crear la cita:", error);
  }
};

// Actualizar cita existente
export const actualizarCita = async (citaActualizada: any) => {
  try {
    const res = await axios.put(
      `${API_CITA}/${citaActualizada.idCita}`,
      citaActualizada
    );
    console.log("Cita actualizada:", res.data);
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
  }
};

// Eliminar cita por ID
export const eliminarCita = async (idCita: number) => {
  try {
    await axios.delete(`${API_CITA}/${idCita}`);
    console.log(`Cita con ID ${idCita} eliminada correctamente`);
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
  }
};


// Exportar todo
export default {
  obtenerCitasProgramadas,
  crearCita,
  actualizarCita,
  eliminarCita
};
