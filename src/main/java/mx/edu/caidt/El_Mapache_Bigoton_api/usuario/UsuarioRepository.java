package mx.edu.caidt.El_Mapache_Bigoton_api.usuario;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Long> {
    Optional<Usuario> findByNombreAndContraseña(String nombre, String contraseña);
    Optional<Usuario> findByNombre(String nombre);
}
