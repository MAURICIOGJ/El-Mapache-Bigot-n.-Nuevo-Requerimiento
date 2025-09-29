import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import UsuariosService from "../Services/UsuarioService";

interface Usuario {
    idUsuario: number;
    nombre: string;
    contraseña: string;
}

export default function Usuario() {
    const emptyUsuario: Usuario = {
        idUsuario: 0,
        nombre: '',
        contraseña: ''
    };

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuario, setUsuario] = useState<Usuario>(emptyUsuario);
    const [usuarioDialog, setUsuarioDialog] = useState<boolean>(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        UsuariosService.findAll().then((response) => setUsuarios(response.data));
    }, []);

    const openNew = () => {
        setUsuario(emptyUsuario);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const saveUsuario = async () => {
        setSubmitted(true);
        if (usuario.nombre.trim() && usuario.contraseña.trim()) {
            const _usuarios = [...usuarios];
            const _usuario = { ...usuario };
            if (usuario.idUsuario) {
                UsuariosService.update(usuario.idUsuario, usuario);
                const index = findIndexById(usuario.idUsuario);
                _usuarios[index] = _usuario;
                toast.current?.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Usuario actualizado",
                    life: 3000,
                });
            } else {
                _usuario.idUsuario = await getIdUsuario(_usuario);
                _usuarios.push(_usuario);
                toast.current?.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Usuario creado",
                    life: 3000,
                });
            }
            setUsuarios(_usuarios);
            setUsuarioDialog(false);
            setUsuario(emptyUsuario);
        }
    };

    const getIdUsuario = async (_usuario: Usuario) => {
        let idUsuario = 0;
        const newUsuario = {
            nombre: _usuario.nombre,
            contraseña: _usuario.contraseña
        };
        await UsuariosService.create(newUsuario)
            .then((response) => {
                idUsuario = response.data.idUsuario;
            })
            .catch((error) => {
                console.error(error);
            });
        return idUsuario;
    };

    const editUsuario = (usuario: Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        const _usuarios = usuarios.filter(
            (val) => val.idUsuario !== usuario.idUsuario
        );
        UsuariosService.delete(usuario.idUsuario);
        setUsuarios(_usuarios);
        setDeleteUsuarioDialog(false);
        setUsuario(emptyUsuario);
        toast.current?.show({
            severity: "success",
            summary: "Successful",
            detail: "Usuario eliminado",
            life: 3000,
        });
    };

    const findIndexById = (idUsuario: number) => {
        return usuarios.findIndex((u) => u.idUsuario === idUsuario);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value || "";
        setUsuario({ ...usuario, nombre: val });
    };

    const onInputChangeContraseña = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value || "";
        setUsuario({ ...usuario, contraseña: val });
    };

    const actionBodyTemplate = (rowData: Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-text p-button-rounded" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" className="p-button-text p-button-rounded p-button-danger" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUsuario} />
        </>
    );

    const deleteUsuarioDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsuarioDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteUsuario} />
        </>
    );

    return (
        
        <div className="flex flex-col items-center p-4">
               
            
            <div className="w-full max-w-3xl">
                <Toast ref={toast} />
                <h2 className="text-2xl font-bold mb-4">REGISTRO DE USUARIOS</h2>
                <DataTable value={usuarios} className="p-datatable-sm" responsiveLayout="scroll" stripedRows showGridlines>
                    <Column field="idUsuario" header="Id" style={{ textAlign: "center" }} />
                    <Column field="nombre" header="Nombre Usuario" style={{ textAlign: "center" }} />
                    <Column field="contraseña" header="Contraseña" style={{ textAlign: "center" }} />
                    <Column body={actionBodyTemplate} headerStyle={{ textAlign: "center" }} bodyStyle={{ textAlign: "center" }} />
                </DataTable>

                <div className="mt-4 text-center">
                    <Button label="Agregar usuario" icon="pi pi-plus" onClick={openNew} />
                </div>

            </div>

            <Dialog visible={usuarioDialog} style={{ width: "450px" }} header="Detalles del Usuario" modal footer={usuarioDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={usuario.nombre} onChange={onInputChange} required autoFocus className={submitted && !usuario.nombre ? "p-invalid" : ""} />
                    {submitted && !usuario.nombre && <small className="p-invalid">El nombre es obligatorio.</small>}
                </div>
                <div className="field">
                    <label htmlFor="contraseña">Contraseña</label>
                    <InputText id="contraseña" value={usuario.contraseña} onChange={onInputChangeContraseña} required className={submitted && !usuario.contraseña ? "p-invalid" : ""} />
                    {submitted && !usuario.contraseña && <small className="p-invalid">La contraseña es obligatoria.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteUsuarioDialog} style={{ width: "450px" }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {usuario && <span>¿Estás seguro de que deseas eliminar a <b>{usuario.nombre}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}

