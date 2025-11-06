import { Link, useNavigate } from 'react-router-dom';

interface MenuProps {
  onLogout: () => void;
}

function Menu({ onLogout }: MenuProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-block flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold"> Mapache Bigotón</h1>
        <p className="text-sm text-block-400">Sistema de Citas</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="block px-4 py-3 rounded hover:bg-gray-700 transition"
            >
               Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/citas"
              className="block px-4 py-3 rounded hover:bg-gray-700 transition"
            >
               Citas Programadas
            </Link>
          </li>
          <li>
            <Link
              to="/historial"
              className="block px-4 py-3 rounded hover:bg-gray-700 transition"
            >
               Historial de Citas
            </Link>
          </li>
          <li>
            <Link
              to="/usuarios"
              className="block px-4 py-3 rounded hover:bg-gray-700 transition"
            >
               Usuarios (Barberos)
            </Link>
          </li>
          <li>
            <Link
              to="/servicios"
              className="block px-4 py-3 rounded hover:bg-gray-700 transition"
            >
              ️ Servicios
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded transition"
        >
           Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Menu;