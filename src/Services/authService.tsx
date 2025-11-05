import axios from "axios";

const API_URL = "http://localhost:8080/usuario/login";

// Login de usuario
export const loginUsuario = async (nombre: string, contraseña: string) => {
    try {
        const response = await axios.post(API_URL, { nombre, contraseña });
        return response.data;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

// Obtener usuario actual del localStorage
export const getUsuarioActual = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
};

// Cerrar sesión
export const logout = () => {
    localStorage.removeItem("usuario");
};

// Exportación por defecto (opcional)
export default {
    loginUsuario,
    getUsuarioActual,
    logout
};