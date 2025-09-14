package mx.edu.caidt.El_Mapache_Bigoton_api.servicio;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;


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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idCita")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Cita cita;
}
