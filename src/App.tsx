import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login';
import Menu from './Components/Menu';
import Principal from './Components/Principal';
import CitasProgramadas from './Components/CitasProgramadas';
import HistorialCitas from './Components/HistorialCitas';
import Usuario from './Components/Usuario';
import Servicio from './Components/Servicio';
import Clientes from './Components/Clientes'; // <-- NUEVA IMPORTACIÓN DEL COMPONENTE CLIENTES
import { getUsuarioActual } from './Services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuario = getUsuarioActual();
    setIsAuthenticated(!!usuario);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado, renderiza el Login (que contiene useNavigate)
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Si está autenticado, renderiza la estructura con el Router
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Menu onLogout={handleLogout} />
        {/* Contenido principal con padding para el menú fijo */}
        <div className="pl-64">
          <Routes>
            <Route path="/" element={<Navigate to="/citasprogramadas" replace />} /> {/* Redirige al Home protegido */}
            <Route path="/citasprogramadas" element={<CitasProgramadas />} />
            <Route path="/historial" element={<HistorialCitas />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/servicios" element={<Servicio />} />
            <Route path="/clientes" element={<Clientes />} /> {/* <-- NUEVA RUTA REGISTRADA */}

            {/* Fallback para cualquier ruta no definida */}
            <Route path="*" element={<Navigate to="/citasprogramadas" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;