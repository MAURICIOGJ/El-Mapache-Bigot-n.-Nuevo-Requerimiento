package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.Cliente;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;

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

    @OneToMany(mappedBy = "cita")
    //@JsonIgnoreProperties("cita")
    private  List<Cita_Servicio> citaServicios;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idCliente")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    //@JsonIgnoreProperties("cita")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idUsuario")
    //@JsonIgnoreProperties("cita")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Usuario usuario;

//    @JsonProperty("servicios")
//    public List<Servicio> getServicios() {
//        if (citaServicios == null) return List.of();
//        return citaServicios.stream()
//                .map(Cita_Servicio::getServicio)
//                .toList();
//    }
}
