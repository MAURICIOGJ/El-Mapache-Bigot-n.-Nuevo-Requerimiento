import axios from "axios";

const API_CLIENTE = "http://localhost:8080/cliente";
const API_SERVICIO = "http://localhost:8080/servicio";
const API_CITA = "http://localhost:8080/cita";

// --- FUNCIÓN DE LECTURA ---
export const obtenerCitasProgramadas = async () => {
  try {
    const resCitas = await axios.get(API_CITA);

    const citasProgramadas = await Promise.all(
      resCitas.data.map(async (cita: any) => {
        const nombreCliente = cita.cliente?.nombre || "N/A";
        const telefonoCliente = cita.cliente?.telefono || "N/A";

        // Obtener servicios de la cita
        let servicios: string[] = [];
        let precios: number[] = [];
        let precioTotal = 0;

        try {
          const resServicios = await axios.get(`${API_CITA}/servicios/${cita.idCita}`);
          if (resServicios.data && Array.isArray(resServicios.data)) {
            servicios = resServicios.data.map((cs: any) => cs.servicio?.descripcion || "N/A");
            precios = resServicios.data.map((cs: any) => cs.servicio?.costo || 0);
            precioTotal = precios.reduce((sum, precio) => sum + precio, 0);
          }
        } catch (error) {
          console.error(`Error obteniendo servicios de cita ${cita.idCita}:`, error);
        }

        return {
          idCita: cita.idCita,
          nombre: nombreCliente,
          telefono: telefonoCliente,
          fecha: cita.fecha,
          hora: cita.hora,
          servicios,
          precios,
          precioTotal,
          idCliente: cita.cliente?.idCliente
        };
      })
    );

    return citasProgramadas;
  } catch (error) {
    console.error("Error obteniendo citas programadas:", error);
    return [];
  }
};

// --- FUNCIÓN PARA OBTENER SERVICIOS ---
export const obtenerServicios = async () => {
  try {
    const resServicios = await axios.get(API_SERVICIO);
    return resServicios.data;
  } catch (error) {
    console.error("Error obteniendo servicios:", error);
    return [];
  }
};

// --- FUNCIÓN DE CREACIÓN (CON LOGGING MEJORADO) ---
export const crearCita = async (clienteData: any, citaData: any, serviciosSeleccionados: number[] = []) => {
  try {
    console.log("📝 Datos recibidos:");
    console.log("Cliente:", clienteData);
    console.log("Cita:", citaData);
    console.log("Servicios seleccionados:", serviciosSeleccionados);

    // 1. Crear cliente
    console.log("🔹 Creando cliente...");
    const resCliente = await axios.post(API_CLIENTE, clienteData);
    const clienteCreado = resCliente.data;
    console.log("✅ Cliente creado:", clienteCreado);

    // 2. Preparar DTO de cita
    const citaDTO = {
      fecha: citaData.fecha,
      hora: citaData.hora,
      idCliente: clienteCreado.idCliente,
      idServicios: serviciosSeleccionados
    };

    console.log("🔹 Enviando cita con DTO:", JSON.stringify(citaDTO, null, 2));

    // 3. Crear cita
    const resCita = await axios.post(API_CITA, citaDTO);
    console.log("✅ Cita creada exitosamente:", resCita.data);

    return resCita.data;
  } catch (error: any) {
    console.error("❌ Error al crear la cita:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request sin respuesta:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    throw error;
  }
};

// --- FUNCIÓN AUXILIAR DE ACTUALIZACIÓN DE CLIENTE ---
export const actualizarCliente = async (idCliente: number, nombre: string, telefono: string) => {
  try {
    if (!idCliente) {
      throw new Error("No se proporcionó un idCliente válido para la actualización.");
    }

    // DTO simple - solo nombre y teléfono
    const clienteDTO = {
      nombre: nombre.trim(),
      telefono: telefono.trim()
    };

    console.log(`🔹 Actualizando cliente ${idCliente} con DTO:`, clienteDTO);

    const res = await axios.put(`${API_CLIENTE}/${idCliente}`, clienteDTO);
    console.log("✅ Cliente actualizado:", res.data);

    return res.data;
  } catch (error: any) {
    console.error("❌ Error al actualizar el cliente:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
};

// --- FUNCIÓN DE ACTUALIZACIÓN PRINCIPAL ---
export const actualizarCita = async (
  idCita: number,
  fecha: string,
  hora: string,
  idCliente: number,
  serviciosSeleccionados: number[] = [],
  nombreCliente?: string,
  telefonoCliente?: string
) => {
  try {
    console.log("🔹 Actualizando cita:", { idCita, fecha, hora, idCliente, serviciosSeleccionados });

    // 1. Actualizar cliente si se proporcionaron datos
    if (nombreCliente && telefonoCliente && idCliente) {
      await actualizarCliente(idCliente, nombreCliente, telefonoCliente);
    }

    // 2. Actualizar la cita usando el formato DTO
    const citaDTO = {
      fecha,
      hora,
      idCliente,
      idServicios: serviciosSeleccionados
    };

    console.log("🔹 Enviando actualización con DTO:", JSON.stringify(citaDTO, null, 2));

    const res = await axios.put(`${API_CITA}/${idCita}`, citaDTO);
    console.log("✅ Cita actualizada:", res.data);

    return res.data;
  } catch (error: any) {
    console.error("❌ Error al actualizar la cita:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    throw error;
  }
};

// --- FUNCIÓN DE ELIMINACIÓN ---
export const eliminarCita = async (idCita: number) => {
  try {
    await axios.delete(`${API_CITA}/${idCita}`);
    console.log(`✅ Cita con ID ${idCita} eliminada correctamente`);
  } catch (error) {
    console.error("❌ Error al eliminar la cita:", error);
    throw error;
  }
};

// --- FUNCIONES ADICIONALES ---
export const obtenerServiciosDeCita = async (idCita: number) => {
  try {
    const res = await axios.get(`${API_CITA}/servicios/${idCita}`);
    return res.data;
  } catch (error) {
    console.error(`❌ Error obteniendo servicios de cita ${idCita}:`, error);
    return [];
  }
};

// --- EXPORTACIÓN FINAL ---
export default {
  obtenerCitasProgramadas,
  obtenerServicios,
  crearCita,
  actualizarCita,
  eliminarCita,
  actualizarCliente,
  obtenerServiciosDeCita
};