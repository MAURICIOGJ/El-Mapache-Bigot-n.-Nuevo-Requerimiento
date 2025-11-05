package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record CitaCreationDTO(
        LocalDate fecha,
        LocalTime hora,
        Long idCliente,
        Long idUsuario,  // ← ESTO ES CRÍTICO
        List<Long> idServicios
) {}