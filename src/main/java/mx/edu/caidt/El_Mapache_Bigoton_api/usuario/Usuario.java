package mx.edu.caidt.El_Mapache_Bigoton_api.usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;

import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    @Column(nullable = false, length = 45)
    private String nombre;
    @Column(name = "contraseña", nullable = false, length = 45)
    private String contraseña;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY) // QUITAMOS CASCADE
    @JsonIgnore
    private List<Cita> cita = new ArrayList<>();
}
