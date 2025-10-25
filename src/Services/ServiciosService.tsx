import axios from "axios";
const URL_BASE = "http://localhost:8080/servicio";
class ServiciosService {


    //Aquí se manda a traer para la generación del CRUD ( Crear, Eliminar, Modificar, Consultar) , para poderse generar el reporte  
    findAll(){
        return axios.get(URL_BASE);
    }
    
    // Se mandan a traer los campos elegidos, a través del id
    findById(idServicio: number){
        return axios.get(URL_BASE + '/' + idServicio);
    }
    
    create(servicio: object){
        return axios.post(URL_BASE, servicio);
    }
    update(idServicio: number, servicio: object){
        return axios.put(URL_BASE + '/'+idServicio, servicio)
    }
    delete(idServicio: number){
        return axios.delete(URL_BASE + '/' + idServicio)
    }   
}
export default new ServiciosService();