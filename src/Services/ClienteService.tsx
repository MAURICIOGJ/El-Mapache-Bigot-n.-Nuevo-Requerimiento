import axios from "axios";

const API_CLIENTE = "http://localhost:8080/cliente";

/**

Servicio independiente para manejar las operaciones de lectura (GET) de la entidad Cliente.
*/
class ClienteService {

/**

Obtiene la lista completa de todos los clientes registrados en la Base de Datos.

@returns Una promesa que resuelve con la lista de clientes.
*/
async findAll() {
try {
// Llama al endpoint http://localhost:8080/cliente
const response = await axios.get(API_CLIENTE);
return response.data;
} catch (error) {
console.error("❌ Error al obtener la lista de clientes:", error);
// Devolver un array vacío en caso de fallo para evitar errores de renderizado
return [];
}
}

// NOTA: Si se necesitara buscar por ID, crear, o actualizar clientes,
// esos métodos irían aquí.
}

export default new ClienteService();