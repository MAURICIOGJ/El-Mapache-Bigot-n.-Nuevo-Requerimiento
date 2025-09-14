package mx.edu.caidt.El_Mapache_Bigoton_api.usuario;

import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<Iterable<Usuario>> findAll() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<Usuario> findById(@PathVariable Long idUsuario) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(idUsuario);
        return usuarioOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario, UriComponentsBuilder uriBuilder) {
        Usuario created = usuarioRepository.save(usuario);
        URI uri = uriBuilder.path("/usuario/{idUsuario}").buildAndExpand(created.getIdUsuario()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<Void> update(@PathVariable Long idUsuario, @RequestBody Usuario usuario) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(idUsuario);
        if (usuarioOptional.isPresent()) {
            usuario.setIdUsuario(usuarioOptional.get().getIdUsuario());
            usuarioRepository.save(usuario);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> delete(@PathVariable Long idUsuario) {
        if(usuarioRepository.findById(idUsuario).isPresent()) {
            usuarioRepository.deleteById(idUsuario);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/cita/{idUsuario}")
    public ResponseEntity<Iterable<Cita>> tCita(@PathVariable Long idUsuario) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(idUsuario);
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.ok(usuarioOptional.get().getCitas());
        }
        return ResponseEntity.notFound().build();
    }
}

