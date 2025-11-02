package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitaRepository extends CrudRepository<Cita, Long> {

    List<Cita> findByUsuarioIdUsuario(Long idUsuario);

    /**
     * Consulta personalizada para asegurar que Cliente y Usuario se carguen
     * de forma EAGER (ansiosa) en una sola consulta. Esto soluciona problemas
     * de serialización que ocurren cuando JPA intenta cargar relaciones LAZY
     * después de que la sesión de la BD ha terminado.
     */
    @Query("SELECT c FROM Cita c JOIN FETCH c.cliente cl JOIN FETCH c.usuario us")
    List<Cita> findAllWithEagerRelationships();
}