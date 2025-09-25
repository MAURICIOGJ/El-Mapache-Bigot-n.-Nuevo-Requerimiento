package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitaRepository extends CrudRepository<Cita, Long> {
    List<Cita> findByUsuarioIdUsuario(Long idUsuario);
}
