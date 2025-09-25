package mx.edu.caidt.El_Mapache_Bigoton_api.cliente;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;
    @Column(nullable = false, length = 45)
    private String nombre;
    @Column(nullable = false, length = 15, unique = true)
    private String telefono;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
   // @JsonIgnoreProperties("cliente")
    private List<Cita> cita = new ArrayList<>();

}
