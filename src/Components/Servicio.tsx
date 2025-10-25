import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import ServiciosService from "../Services/ServiciosService";
import { InputNumber } from "primereact/inputnumber";

interface Servicio {
    idServicio: number;
    descripcion: string;
    costo: number;
}

export default function Servicio() {
    const emptyServicio: Servicio = {
        idServicio: 0,
        descripcion: "",
        costo: 0
    };

    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [servicio, setServicio] = useState<Servicio>(emptyServicio);
    const [servicioDialog, setServicioDialog] = useState(false);
    const [deleteServicioDialog, setDeleteServicioDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        ServiciosService.findAll().then((response) => setServicios(response.data));
    }, []);

    const openNew = () => {
        setServicio(emptyServicio);
        setSubmitted(false);
        setServicioDialog(true);
    };

    const hideDialog = () => setServicioDialog(false);
    const hideDeleteServicioDialog = () => setDeleteServicioDialog(false);

    const saveServicio = async () => {
        setSubmitted(true);
        if (servicio.descripcion.trim()) {
            const _servicios = [...servicios];
            const _servicio = { ...servicio };
            if (servicio.idServicio) {
                ServiciosService.update(servicio.idServicio, servicio);
                const index = findIndexById(servicio.idServicio);
                _servicios[index] = _servicio;
                toast.current?.show({
                    severity: "success",
                    summary: "OK",
                    detail: "Servicio actualizado",
                    life: 3000,
                });
            } else {
                _servicio.idServicio = await getIdServicio(_servicio);
                _servicios.push(_servicio);
                toast.current?.show({
                    severity: "success",
                    summary: "OK",
                    detail: "Servicio creado",
                    life: 3000,
                });
            }
            setServicios(_servicios);
            setServicioDialog(false);
            setServicio(emptyServicio);
        }
    };

    const getIdServicio = async (_servicio: Servicio) => {
        let idServicio = 0;
        await ServiciosService.create({
            descripcion: _servicio.descripcion,  
            costo: _servicio.costo
        })
            .then((response) => {
                idServicio = response.data.idServicio;
            });
        return idServicio;
    };

    const editServicio = (servicio: Servicio) => {
        setServicio({ ...servicio });
        setServicioDialog(true);
    };

    const confirmDeleteServicio = (servicio: Servicio) => {
        setServicio(servicio);
        setDeleteServicioDialog(true);
    };

    const deleteServicio = () => {
        const _servicios = servicios.filter((s) => s.idServicio !== servicio.idServicio);
        ServiciosService.delete(servicio.idServicio);
        setServicios(_servicios);
        setDeleteServicioDialog(false);
        toast.current?.show({
            severity: "success",
            summary: "OK",
            detail: "Servicio eliminado",
            life: 3000,
        });
    };

    const findIndexById = (idServicio: number) => {
        return servicios.findIndex((s) => s.idServicio === idServicio);
    };

    const actionBodyTemplate = (rowData: Servicio) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-button-rounded" onClick={() => editServicio(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-rounded p-button-danger" onClick={() => confirmDeleteServicio(rowData)} />
        </>
    );

    const servicioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveServicio} />
        </>
    );

    const deleteServicioDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteServicioDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteServicio} />
        </>
    );

    return (
        <div className="flex flex-col items-center p-4">

            <div className="w-full max-w-3xl">
                <Toast ref={toast} />
                <h2 className="text-2xl font-bold mb-4">REGISTRO DE SERVICIOS</h2>
                <DataTable value={servicios} className="p-datatable-sm" responsiveLayout="scroll" stripedRows showGridlines>
                    <Column field="idServicio" header="Id" style={{ textAlign: "center" }} />
                    <Column field="descripcion" header="Descripción" style={{ textAlign: "center" }} />
                    <Column field="costo" header="Costo" style={{ textAlign: "center" }} />
                    <Column body={actionBodyTemplate} headerStyle={{ textAlign: "center" }} bodyStyle={{ textAlign: "center" }} />
                </DataTable>

                <div className="mt-4 text-center">
                    <Button label="Agregar servicio" icon="pi pi-plus" onClick={openNew} />
                </div>
            </div>

            <Dialog visible={servicioDialog} style={{ width: "450px" }} header="Detalles del Servicio" modal footer={servicioDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="descripcion">Descripción</label>
                    <InputText
                        id="descripcion"   // <-- sin tilde
                        value={servicio.descripcion}
                        onChange={(e) => setServicio({ ...servicio, descripcion: e.target.value })}
                        required
                        autoFocus
                        className={submitted && !servicio.descripcion ? "p-invalid" : ""}
                    />
                    {submitted && !servicio.descripcion && (
                        <small className="p-invalid">La descripción es obligatoria.</small>
                    )}
                </div>



                <div className="field">
                    <label htmlFor="costo">Costo</label>
                    <InputNumber id="costo" value={servicio.costo} onValueChange={(e) => setServicio({ ...servicio, costo: e.value || 0 })} mode="currency" currency="USD" locale="en-US" className={submitted && servicio.costo <= 0 ? "p-invalid" : ""} />
                    {submitted && servicio.costo <= 0 && <small className="p-invalid">El precio es obligatorio y debe ser mayor a cero.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteServicioDialog} style={{ width: "450px" }} header="Confirmar" modal footer={deleteServicioDialogFooter} onHide={hideDeleteServicioDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {servicio && <span>¿Estás seguro de que deseas eliminar el servicio <b>{servicio.descripcion}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}
