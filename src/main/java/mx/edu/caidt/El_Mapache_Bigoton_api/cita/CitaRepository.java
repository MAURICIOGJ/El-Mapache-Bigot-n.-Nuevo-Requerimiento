package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitaRepository extends CrudRepository<Cita, Long> {

    List<Cita> findByUsuarioIdUsuario(Long idUsuario);

    /**
     * Obtener todas las citas con relaciones cargadas EAGER
     */
    @Query("SELECT c FROM Cita c JOIN FETCH c.cliente cl JOIN FETCH c.usuario us")
    List<Cita> findAllWithEagerRelationships();

    /**
     * Obtener solo citas PROGRAMADAS ordenadas por fecha y hora
     */
    @Query("SELECT c FROM Cita c JOIN FETCH c.cliente cl JOIN FETCH c.usuario us " +
            "WHERE c.estado = 'PROGRAMADA' " +
            "ORDER BY c.fecha ASC, c.hora ASC")
    List<Cita> findCitasProgramadasOrdenadas();

    /**
     * Obtener citas COMPLETADAS ordenadas por fecha completada (más reciente primero)
     */
    @Query("SELECT c FROM Cita c JOIN FETCH c.cliente cl JOIN FETCH c.usuario us " +
            "WHERE c.estado = 'COMPLETADA' " +
            "ORDER BY c.fechaCompletada DESC")
    List<Cita> findCitasCompletadas();

    /**
     * Obtener citas CANCELADAS
     */
    @Query("SELECT c FROM Cita c JOIN FETCH c.cliente cl JOIN FETCH c.usuario us " +
            "WHERE c.estado = 'CANCELADA' " +
            "ORDER BY c.fechaCompletada DESC")
    List<Cita> findCitasCanceladas();

    /**
     * Buscar citas por estado
     */
    List<Cita> findByEstado(String estado);
}