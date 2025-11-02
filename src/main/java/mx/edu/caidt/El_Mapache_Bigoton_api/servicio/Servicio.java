package mx.edu.caidt.El_Mapache_Bigoton_api.servicio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString(exclude = "citaServicios")
@Entity
@Table(name = "servicio")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Long idServicio;

    @Column(name = "descripcion", nullable = false, length = 50)
    private String descripcion;

    @Column(name = "costo", nullable = false)
    private Double costo;

    @OneToMany(mappedBy = "servicio", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Cita_Servicio> citaServicios = new ArrayList<>();
}