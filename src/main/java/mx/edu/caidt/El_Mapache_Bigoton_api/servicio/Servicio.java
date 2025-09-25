package mx.edu.caidt.El_Mapache_Bigoton_api.servicio;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;

import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Entity
@Table(name = "servicio")
public class Servicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idServicio;
    @Column(nullable = false, length = 50)
    private String descripcion;
    @Column(nullable = false)
    private double costo;

    @OneToMany(mappedBy = "servicio")
    //@JsonIgnoreProperties("servicio")
    private List<Cita_Servicio> citaServicios;
}
