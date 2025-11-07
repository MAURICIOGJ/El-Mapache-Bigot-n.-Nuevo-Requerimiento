import { useState, useEffect, useCallback } from "react";
// Importamos el servicio que ya creaste en Services/ClienteService.tsx
import ClienteService from '../Services/ClienteService';

// Interfaz para el objeto Cliente
interface Cliente {
    idCliente: number;
    nombre: string;
    telefono: string;
}

function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [cargando, setCargando] = useState(true);

    // Función para cargar los clientes desde el Back End
    const fetchClientes = useCallback(async () => {
        setCargando(true);
        try {
            // Llama a ClienteService.findAll() (GET /cliente)
            const data = await ClienteService.findAll();
            setClientes(data);
        } catch (error) {
            console.error("Error al cargar la lista de clientes:", error);
            setClientes([]);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Lista de Clientes
            </h1>

            {cargando ? (
                <div className="text-center py-8">Cargando clientes...</div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Nombre</th>
                                <th className="px-4 py-3 text-left">Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.idCliente} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{cliente.idCliente}</td>
                                    <td className="px-4 py-3">{cliente.nombre}</td>
                                    <td className="px-4 py-3">{cliente.telefono}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {clientes.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron clientes registrados.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ¡Esta línea es esencial para que App.tsx pueda cargarlo!
export default Clientes;