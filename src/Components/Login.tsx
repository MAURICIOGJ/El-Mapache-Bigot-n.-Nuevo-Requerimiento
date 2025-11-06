import { useState } from "react";
import { loginUsuario } from "../Services/authService";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const usuario = await loginUsuario(nombre, contraseña);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      onLogin();
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6">
           Mapache Bigotón
        </h1>
        <h2 className="text-xl text-center mb-6 text-gray-600">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Usuario</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-500 hover:bg-blue-600 text-black py-2 rounded disabled:bg-gray-400"
          >
            {cargando ? "Iniciando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;