import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import {
    obtenerCitasProgramadas,
    crearCita,
    actualizarCita,
    eliminarCita,
} from "../Services/CitasService";

const CitasProgramadas = () => {
    const [citas, setCitas] = useState<any[]>([]);
    const [citaSeleccionada, setCitaSeleccionada] = useState<any>({
        idCliente: null,
        idCita: null,
        nombre: "",
        telefono: "",
        fecha: "",
        hora: "",
        servicio: [],
        precio: 0,
    });
    const [mostrarDialogo, setMostrarDialogo] = useState(false);
    const [serviciosDisponibles, setServiciosDisponibles] = useState<any[]>([]);

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        const data = await obtenerCitasProgramadas();
        setCitas(data);

        // Generar lista de servicios únicos para el MultiSelect
        const servicios = data.flatMap((cita: { servicios: string[]; precios: number[] }) =>
            cita.servicios.map((s: string, index: number) => ({
                label: s,
                value: s,
                precio: cita.precios[index],
            }))
        );

        setServiciosDisponibles(servicios);
    };

    const abrirNuevaCita = () => {
        setCitaSeleccionada({
            idCliente: null,
            idCita: null,
            nombre: "",
            telefono: "",
            fecha: "",
            hora: "",
            servicio: [],
            precio: 0,
        });
        setMostrarDialogo(true);
    };

    const editarCita = (cita: any) => {
        setCitaSeleccionada({ ...cita });
        setMostrarDialogo(true);
    };

    const guardarCita = async () => {
        if (citaSeleccionada.idCita) {
            // actualizar cita existente
            await actualizarCita(citaSeleccionada);
        } else {
            // crear nueva cita
            const clienteData = {
                nombre: citaSeleccionada.nombre,
                telefono: citaSeleccionada.telefono,
            };

            const citaData = {
                fecha: citaSeleccionada.fecha,
                hora: citaSeleccionada.hora,
                citaServicios: citaSeleccionada.servicio.map((servicio: string) => ({
                    servicio: { descripcion: servicio },
                })),
            };

            await crearCita(clienteData, citaData);
        }

        setMostrarDialogo(false);
        fetchCitas();
    };

    const borrarCita = async (cita: any) => {
        if (window.confirm("¿Deseas eliminar esta cita?")) {
            await eliminarCita(cita.idCliente); // eliminamos cliente asociado
            fetchCitas();
        }
    };

    // Recalcular precio cuando cambien los servicios seleccionados
    const handleServicioChange = (e: any) => {
        const seleccion = e.value;
        const total = seleccion.reduce((acc: number, servicio: string) => {
            const item = serviciosDisponibles.find((s) => s.value === servicio);
            return acc + (item?.precio || 0);
        }, 0);

        setCitaSeleccionada({
            ...citaSeleccionada,
            servicio: seleccion,
            precio: total,
        });
    };

    const footerDialog = (
        <div className="flex justify-end gap-3">
            <Button
                label="Cancelar"
                className="p-button-text"
                onClick={() => setMostrarDialogo(false)}
            />
            <Button label="Guardar" icon="pi pi-check" onClick={guardarCita} />
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Citas Programadas</h2>

            <DataTable value={citas} paginator rows={5} responsiveLayout="scroll">
                <Column field="nombre" header="Nombre"></Column>
                <Column field="telefono" header="Teléfono"></Column>
                <Column
                    header="Servicios"
                    body={(rowData) => rowData.servicios.join(", ")}
                />
                <Column field="fecha" header="Fecha"></Column>
                <Column field="hora" header="Hora"></Column>
                <Column field="precioTotal" header="Total" />

                <Column
                    body={(rowData) => (
                        <div className="flex gap-2">
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-success"
                                onClick={() => editarCita(rowData)}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                onClick={() => borrarCita(rowData)}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <div className="mt-4">
                <Button label="Nuevo" icon="pi pi-plus" onClick={abrirNuevaCita} />
            </div>

            <Dialog
                header={citaSeleccionada?.idCita ? "Editar Cita" : "Nueva Cita"}
                visible={mostrarDialogo}
                onHide={() => setMostrarDialogo(false)}
                footer={footerDialog}
                style={{ width: "32rem" }}
            >
                {/* Nombre */}
                <div className="field flex align-items-center">
                    <i className="pi pi-user mr-2" style={{ fontSize: "1.5rem" }}></i>
                    <label htmlFor="nombre">Nombre</label>
                    <InputText
                        placeholder="Ingresar el nombre del cliente"
                        className="flex-1"
                        value={citaSeleccionada.nombre}
                        onChange={(e) =>
                            setCitaSeleccionada({
                                ...citaSeleccionada,
                                nombre: e.target.value,
                            })
                        }
                    />
                </div>

                {/* Teléfono */}
                <div className="field flex align-items-center">
                    <i className="pi pi-phone mr-2" style={{ fontSize: "1.5rem" }}></i>
                    <label htmlFor="telefono">Teléfono</label>
                    <InputText
                        placeholder="Ingresar el número de contacto"
                        className="flex-1"
                        value={citaSeleccionada.telefono}
                        onChange={(e) =>
                            setCitaSeleccionada({
                                ...citaSeleccionada,
                                telefono: e.target.value,
                            })
                        }
                    />
                </div>

                {/* Fecha */}
                <div className="field flex align-items-center">
                    <i className="pi pi-calendar mr-2" style={{ fontSize: "1.5rem" }}></i>
                    <label htmlFor="fecha" className="mr-2">Fecha</label>
                    <InputText
                        id="fecha"
                        type="date"
                        value={citaSeleccionada.fecha}
                        onChange={(e) =>
                            setCitaSeleccionada({
                                ...citaSeleccionada,
                                fecha: e.target.value,
                            })
                        }
                    />
                </div>

                {/* Hora */}
                <div className="field flex align-items-center mt-3">
                    <i className="pi pi-clock mr-2" style={{ fontSize: "1.5rem" }}></i>
                    <label htmlFor="hora" className="mr-2">Hora</label>
                    <InputText
                        id="hora"
                        type="time"
                        step="1"
                        value={citaSeleccionada.hora}
                        onChange={(e) =>
                            setCitaSeleccionada({
                                ...citaSeleccionada,
                                hora: e.target.value,
                            })
                        }
                    />
                </div>

                {/* Servicios */}
                <div className="field flex align-items-center">
                    <i className="pi pi-users mr-2" style={{ fontSize: "1.5rem" }}></i>
                    <label htmlFor="servicios">Servicios</label>
                    <MultiSelect
                        value={citaSeleccionada.servicio}
                        options={serviciosDisponibles}
                        onChange={handleServicioChange}
                        placeholder="Seleccionar"
                        display="chip"
                        className="flex-1"
                    />
                </div>

                {/* Precio */}
                <div className="field flex align-items-center">
                    <i className="pi pi-dollar mr-2" style={{ fontSize: "1.5rem" }}></i>
                    <label htmlFor="precio">Precio</label>
                    <InputNumber
                        value={citaSeleccionada.precio}
                        mode="currency"
                        currency="MXN"
                        locale="es-MX"
                        className="flex-1"
                        disabled
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default CitasProgramadas;