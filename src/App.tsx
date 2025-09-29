import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Principal from './Components/Principal';
import Menu from './Components/Menu';
import CitasProgramadas from './Components/CitasProgramadas';
import Usuario from './Components/Usuario';
import Servicio from './Components/Servicio';
//import Servicios from './Components/Servicios';
//import Usuarios from './Components/Usuarios';

function AppContent() {
  const location = useLocation();

  // Ocultar menú en Login y Principal
  const hideMenu = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {/* Mostrar el menú solo si NO estamos en Principal ni Login */}
      {!hideMenu && (
        <Menu
          onNavigate={(route) => {
            console.log(`Navegar a: ${route}`);
          }}
        />
      )}

      {/* Rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citasprogramadas" element={<CitasProgramadas />} />
        <Route path="/servicios" element={<Servicio />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
