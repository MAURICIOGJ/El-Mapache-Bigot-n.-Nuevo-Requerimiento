package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

/**
 * DTO para devolver información de los servicios asociados a una cita
 * Evita problemas de serialización con relaciones circulares
 */
public record CitaServicioDTO(
        Long idCitaServicio,
        Long idServicio,
        String descripcion,
        Double costo
) {
    /**
     * Constructor de conveniencia desde Cita_Servicio
     */
    public static CitaServicioDTO from(mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio cs) {
        return new CitaServicioDTO(
                cs.getIdCitaServicio(),
                cs.getServicio().getIdServicio(),
                cs.getServicio().getDescripcion(),
                cs.getServicio().getCosto()
        );
    }
}