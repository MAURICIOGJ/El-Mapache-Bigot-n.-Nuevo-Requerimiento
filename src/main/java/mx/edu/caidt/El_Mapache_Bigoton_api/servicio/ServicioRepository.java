package mx.edu.caidt.El_Mapache_Bigoton_api.servicio;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends CrudRepository<Servicio, Long> {
}
