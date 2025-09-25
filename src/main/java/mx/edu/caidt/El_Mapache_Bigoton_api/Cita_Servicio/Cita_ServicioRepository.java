package mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Cita_ServicioRepository extends CrudRepository<Cita_Servicio, Long> {
}
