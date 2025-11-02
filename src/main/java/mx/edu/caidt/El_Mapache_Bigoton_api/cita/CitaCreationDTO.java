// Archivo: CitaCreationDTO.java
package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Data Transfer Object (DTO) para recibir los datos de creación o actualización
 * de una Cita desde el Front End.
 * Usa Java Record (disponible desde Java 16) para simplicidad.
 */
public record CitaCreationDTO(
        LocalDate fecha,
        LocalTime hora,
        Long idCliente, // ID del Cliente

        // Este campo recibe el array de números (IDs) de los servicios seleccionados del Front End.
        List<Long> idServicios
) {}