import axios from "axios";
const URL_BASE = "http://localhost:8080/usuario";

class UsuarioService {

    //Aquí se manda a traer para la generación del CRUD ( Crear, Eliminar, Modificar, Consultar) , para poderse generar el reporte
    findAll(){
        return axios.get(URL_BASE);
    }

    // Se mandan a traer los campos elegidos, a través del id
    findById(idUsuario: number){
        return axios.get(URL_BASE + '/' + idUsuario); // <-- CORREGIDO: "rexturn" a "return"
    }
    
    create(usuario: object){
        return axios.post(URL_BASE, usuario);
    }
    update(idUsuario: number, usuario: object){
        return axios.put(URL_BASE + '/'+idUsuario, usuario)
    }
    delete(idUsuario: number){
        return axios.delete(URL_BASE + '/' + idUsuario)
    }   
}
export default new UsuarioService();