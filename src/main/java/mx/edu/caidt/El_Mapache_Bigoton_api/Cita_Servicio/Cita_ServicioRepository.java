package mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface Cita_ServicioRepository extends CrudRepository<Cita_Servicio, Long> {

    /**
     * Encuentra todas las relaciones Cita-Servicio para una cita específica
     * @param idCita ID de la cita
     * @return Lista de relaciones Cita_Servicio
     */
    List<Cita_Servicio> findByCitaIdCita(Long idCita);

    /**
     * Elimina todas las relaciones Cita-Servicio para una cita específica
     * Útil cuando se actualizan los servicios de una cita
     * @param idCita ID de la cita
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM Cita_Servicio cs WHERE cs.cita.idCita = :idCita")
    void deleteByCitaIdCita(@Param("idCita") Long idCita);
}