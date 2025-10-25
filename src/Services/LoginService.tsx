import axios from "axios";

const API_URL = "http://localhost:8080/usuario/login";

// 🔹 Login
export const loginUsuario = async (nombre: string, contraseña: string) => {
    try {
        const response = await axios.post(API_URL, { nombre, contraseña });
        return response.data; // retorna el usuario si es correcto
    } catch (error) {
        throw error; // manejar errores en el componente
    }
};

export const getUsuarioActual = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
};

export const logout = () => {
    localStorage.removeItem("usuario");
};


