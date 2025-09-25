package mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
@ToString
@Entity
@Table(name = "cita_servicio")
public class Cita_Servicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCitaServicio;

    @ManyToOne
    @JoinColumn(name = "idCita")
    //@JsonIgnoreProperties("citaServicios")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Cita cita;

    @ManyToOne
    @JoinColumn(name = "idServicio")
    //@JsonIgnoreProperties("citaServicios")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Servicio servicio;

}
