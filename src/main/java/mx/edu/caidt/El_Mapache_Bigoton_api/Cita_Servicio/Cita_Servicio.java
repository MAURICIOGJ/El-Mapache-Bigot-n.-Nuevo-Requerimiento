package mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString(exclude = {"cita", "servicio"})
@Entity
@Table(name = "cita_servicio")
public class Cita_Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita_servicio")
    private Long idCitaServicio;

    // La relación con Cita debe permitir que cascade funcione desde Cita
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cita", nullable = false, referencedColumnName = "id_cita")
    @JsonBackReference("cita-citaservicios")
    private Cita cita;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_servicio", nullable = false, referencedColumnName = "id_servicio")
    private Servicio servicio;
}