package mx.edu.caidt.El_Mapache_Bigoton_api.cliente;

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
@Table(name = "Cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;
    @Column(nullable = false, length = 45)
    private String nombre;
    @Column(nullable = false, length = 15, unique = true)
    private String telefono;

    @OneToOne
    @JoinColumn(name = "idCita")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Cita cita;


}
