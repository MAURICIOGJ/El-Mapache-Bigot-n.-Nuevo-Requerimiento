package mx.edu.caidt.El_Mapache_Bigoton_api.usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;

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
    @Column(nullable = false, length = 45)
    private String contraseña;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Cita> citas;
}
