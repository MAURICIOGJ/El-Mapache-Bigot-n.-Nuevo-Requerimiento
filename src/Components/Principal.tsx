import mapache from '../assets/BarberiaMapache.jpg';
import { Link } from "react-router-dom";
import '../styles/Principal.css';


function Principal() {
  return (
    <div className="container">
      <h1 className="title">
        Bienvenidos a la Barbería <br /> El Mapache Bigotón
      </h1>

      <img src={mapache} alt="Logo Mapache Bigotón" className="image" />

      <Link to="/login" style={{ textDecoration: "none" }}>
        <button className="button">Iniciar sesión</button>
      </Link>
    </div>
  );
}

export default Principal;
