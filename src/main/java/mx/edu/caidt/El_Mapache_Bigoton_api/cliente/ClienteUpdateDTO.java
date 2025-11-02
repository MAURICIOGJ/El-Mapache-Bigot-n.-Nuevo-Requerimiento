package mx.edu.caidt.El_Mapache_Bigoton_api.cliente;

/**
 * DTO para actualizar un cliente sin enviar relaciones
 */
public record ClienteUpdateDTO(
        String nombre,
        String telefono
) {}