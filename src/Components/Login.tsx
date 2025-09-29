import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { loginUsuario } from "../Services/LoginService";
import mapache from '../assets/mapache.png';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Login = () => {
    const [nombre, setNombre] = useState("");       
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        try {
            const usuario = await loginUsuario(nombre, contraseña);
            console.log("Usuario logueado:", usuario);

            // Guardar en localStorage
            localStorage.setItem("usuario", JSON.stringify(usuario));

            // Redirigir solo si el login fue correcto
            navigate("/citasprogramadas");
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError("Usuario o contraseña incorrectos");
            } else {
                setError("Error al conectarse al servidor");
            }
        }
    };

    return (
        <div style={{
            width: '300px',
            margin: '100px auto',
            textAlign: 'center',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <img src={mapache} alt="Logo" style={{ width: '100%', marginBottom: '20px' }} />
            </div>

            <div className="p-field" style={{ marginBottom: '15px' }}>
                <InputText
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingresar usuario"
                    style={{ width: '100%' }}
                />
            </div>

            <div className="p-field" style={{ marginBottom: '20px' }}>
                <Password
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    placeholder="Ingresar contraseña"
                    toggleMask
                    style={{ width: '100%' }}
                />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Ejecuta el login al hacer clic */}
            <Button 
                label="Acceder" 
                icon="pi pi-sign-in" 
                style={{ width: '100%' }}
                onClick={handleLogin}
            />
        </div>
    );
};

export default Login;


