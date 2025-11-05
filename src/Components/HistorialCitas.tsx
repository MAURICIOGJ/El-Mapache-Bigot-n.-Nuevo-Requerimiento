import axios from "axios";

const API_CLIENTE = "http://localhost:8080/cliente";
const API_SERVICIO = "http://localhost:8080/servicio";
const API_CITA = "http://localhost:8080/cita";
const API_USUARIO = "http://localhost:8080/usuario";

// --- FUNCIÓN DE LECTURA - CITAS PROGRAMADAS ORDENADAS ---
export const obtenerCitasProgramadas = async () => {
  try {
    const resCitas = await axios.get(API_CITA);

    const citasProgramadas = await Promise.all(
      resCitas.data.map(async (cita: any) => {
        const nombreCliente = cita.cliente?.nombre || "N/A";
        const telefonoCliente = cita.cliente?.telefono || "N/A";
        const nombreBarbero = cita.usuario?.nombre || "N/A";

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
          barbero: nombreBarbero,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado,
          servicios,
          precios,
          precioTotal,
          idCliente: cita.cliente?.idCliente,
          idUsuario: cita.usuario?.idUsuario
        };
      })
    );

    return citasProgramadas;
  } catch (error) {
    console.error("Error obteniendo citas programadas:", error);
    return [];
  }
};

// --- FUNCIÓN PARA OBTENER HISTORIAL DE CITAS COMPLETADAS ---
export const obtenerCitasCompletadas = async () => {
  try {
    const resCitas = await axios.get(`${API_CITA}/completadas`);

    const citasCompletadas = await Promise.all(
      resCitas.data.map(async (cita: any) => {
        const nombreCliente = cita.cliente?.nombre || "N/A";
        const telefonoCliente = cita.cliente?.telefono || "N/A";
        const nombreBarbero = cita.usuario?.nombre || "N/A";

        let servicios: string[] = [];
        let precioTotal = 0;

        try {
          const resServicios = await axios.get(`${API_CITA}/servicios/${cita.idCita}`);
          if (resServicios.data && Array.isArray(resServicios.data)) {
            servicios = resServicios.data.map((cs: any) => cs.servicio?.descripcion || "N/A");
            const precios = resServicios.data.map((cs: any) => cs.servicio?.costo || 0);
            precioTotal = precios.reduce((sum, precio) => sum + precio, 0);
          }
        } catch (error) {
          console.error(`Error obteniendo servicios:`, error);
        }

        return {
          idCita: cita.idCita,
          nombre: nombreCliente,
          telefono: telefonoCliente,
          barbero: nombreBarbero,
          fecha: cita.fecha,
          hora: cita.hora,
          fechaCompletada: cita.fechaCompletada,
          servicios,
          precioTotal,
          idCliente: cita.cliente?.idCliente
        };
      })
    );

    return citasCompletadas;
  } catch (error) {
    console.error("Error obteniendo citas completadas:", error);
    return [];
  }
};

// --- FUNCIÓN PARA OBTENER CITAS CANCELADAS ---
export const obtenerCitasCanceladas = async () => {
  try {
    const resCitas = await axios.get(`${API_CITA}/canceladas`);

    const citasCanceladas = await Promise.all(
      resCitas.data.map(async (cita: any) => {
        return {
          idCita: cita.idCita,
          nombre: cita.cliente?.nombre || "N/A",
          telefono: cita.cliente?.telefono || "N/A",
          barbero: cita.usuario?.nombre || "N/A",
          fecha: cita.fecha,
          hora: cita.hora,
          fechaCancelada: cita.fechaCompletada,
          motivoCancelacion: cita.motivoCancelacion || "Sin motivo"
        };
      })
    );

    return citasCanceladas;
  } catch (error) {
    console.error("Error obteniendo citas canceladas:", error);
    return [];
  }
};

export const obtenerServicios = async () => {
  try {
    const resServicios = await axios.get(API_SERVICIO);
    return resServicios.data;
  } catch (error) {
    console.error("Error obteniendo servicios:", error);
    return [];
  }
};

export const obtenerBarberos = async () => {
  try {
    const resBarberos = await axios.get(API_USUARIO);
    return resBarberos.data;
  } catch (error) {
    console.error("Error obteniendo barberos:", error);
    return [];
  }
};

export const crearCita = async (
  clienteData: any,
  citaData: any,
  idBarbero: number,
  serviciosSeleccionados: number[] = []
) => {
  try {
    const resCliente = await axios.post(API_CLIENTE, clienteData);
    const clienteCreado = resCliente.data;

    const citaDTO = {
      fecha: citaData.fecha,
      hora: citaData.hora,
      idCliente: clienteCreado.idCliente,
      idUsuario: idBarbero,
      idServicios: serviciosSeleccionados
    };

    const resCita = await axios.post(API_CITA, citaDTO);
    console.log("✅ Cita creada");
    return resCita.data;
  } catch (error: any) {
    console.error("❌ Error al crear la cita:", error);
    throw error;
  }
};

export const actualizarCliente = async (idCliente: number, nombre: string, telefono: string) => {
  try {
    const clienteDTO = { nombre: nombre.trim(), telefono: telefono.trim() };
    const res = await axios.put(`${API_CLIENTE}/${idCliente}`, clienteDTO);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al actualizar el cliente:", error);
    throw error;
  }
};

export const actualizarCita = async (
  idCita: number,
  fecha: string,
  hora: string,
  idCliente: number,
  idBarbero: number,
  serviciosSeleccionados: number[] = [],
  nombreCliente?: string,
  telefonoCliente?: string
) => {
  try {
    if (nombreCliente && telefonoCliente && idCliente) {
      await actualizarCliente(idCliente, nombreCliente, telefonoCliente);
    }

    const citaDTO = {
      fecha,
      hora,
      idCliente,
      idUsuario: idBarbero,
      idServicios: serviciosSeleccionados
    };

    const res = await axios.put(`${API_CITA}/${idCita}`, citaDTO);
    console.log("✅ Cita actualizada");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al actualizar la cita:", error);
    throw error;
  }
};

// --- MARCAR CITA COMO COMPLETADA ---
export const completarCita = async (idCita: number) => {
  try {
    await axios.put(`${API_CITA}/${idCita}/completar`);
    console.log(`✅ Cita ${idCita} completada`);
  } catch (error) {
    console.error("❌ Error al completar cita:", error);
    throw error;
  }
};

// --- MARCAR CITA COMO CANCELADA ---
export const cancelarCita = async (idCita: number, motivo: string) => {
  try {
    await axios.put(`${API_CITA}/${idCita}/cancelar`, motivo, {
      headers: { 'Content-Type': 'text/plain' }
    });
    console.log(`✅ Cita ${idCita} cancelada`);
  } catch (error) {
    console.error("❌ Error al cancelar cita:", error);
    throw error;
  }
};

// --- ELIMINAR PERMANENTEMENTE (ya no se usa normalmente) ---
export const eliminarCita = async (idCita: number) => {
  try {
    await axios.delete(`${API_CITA}/${idCita}`);
    console.log(`✅ Cita ${idCita} eliminada permanentemente`);
  } catch (error: any) {
    console.error("❌ Error al eliminar la cita:", error);
    throw error;
  }
};

export default {
  obtenerCitasProgramadas,
  obtenerCitasCompletadas,
  obtenerCitasCanceladas,
  obtenerServicios,
  obtenerBarberos,
  crearCita,
  actualizarCita,
  completarCita,
  cancelarCita,
  eliminarCita,
  actualizarCliente
};