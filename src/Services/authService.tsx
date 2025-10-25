/*export const getUsuarioLogueado = () => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) return null;
    return JSON.parse(usuario); // retorna el objeto completo
};

export const getUsuarioId = () => {
    const usuario = getUsuarioLogueado();
    return usuario ? usuario.idUsuario : null; // retorna el ID
};*/

export const getUsuarioActual = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
};

export const logout = () => {
    localStorage.removeItem("usuario");
};

