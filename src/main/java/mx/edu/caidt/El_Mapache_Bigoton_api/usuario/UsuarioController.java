package mx.edu.caidt.El_Mapache_Bigoton_api.usuario;

import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;

import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.ClienteRepository;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping()
    public ResponseEntity<Iterable<Usuario>> findAll() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<Usuario> findById(@PathVariable Long idUsuario) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(idUsuario);
        return usuarioOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear nuevo usuario
    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario, UriComponentsBuilder uriBuilder) {
        Usuario created = usuarioRepository.save(usuario);
        URI uri = uriBuilder.path("/usuarios/{idUsuario}")
                .buildAndExpand(created.getIdUsuario())
                .toUri();
        return ResponseEntity.created(uri).body(created);
    }

    // Actualizar usuario
    @PutMapping("/{idUsuario}")
    public ResponseEntity<Usuario> update(@PathVariable Long idUsuario, @RequestBody Usuario usuario) {
        if (!usuarioRepository.existsById(idUsuario)) {
            return ResponseEntity.notFound().build();
        }
        usuario.setIdUsuario(idUsuario);
        Usuario updated = usuarioRepository.save(usuario);
        return ResponseEntity.ok(updated);
    }

    // Eliminar usuario
    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> delete(@PathVariable Long idUsuario) {
        if (usuarioRepository.existsById(idUsuario)) {
            usuarioRepository.deleteById(idUsuario);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Obtener la cita de un usuario
    @GetMapping("/cita/{idUsuario}")
    public ResponseEntity<Iterable<Cita>> tCitas(@PathVariable Long idUsuario) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(idUsuario);
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.ok(usuarioOptional.get().getCita());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciales) {
        String nombre = credenciales.get("nombre");
        String contraseña = credenciales.get("contraseña");

        Optional<Usuario> usuarioOptional = usuarioRepository.findByNombre(nombre);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            if (usuario.getContraseña().equals(contraseña)) {
                return ResponseEntity.ok(usuario); // Devuelves el usuario si es correcto
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // contraseña incorrecta
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // usuario no encontrado
    }




}


