package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.Cliente;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Entity
@Table(name = "cita")
public class Cita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCita;
    @Column(nullable = false)
    private LocalDate fecha;
    @Column(nullable = false)
    private LocalTime hora;

    @OneToMany(mappedBy = "cita", cascade = CascadeType.ALL)
    private List<Servicio> servicios = new ArrayList<>();

    @OneToOne(mappedBy = "cita", cascade = CascadeType.ALL)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idUsuario")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Usuario usuario;
}
