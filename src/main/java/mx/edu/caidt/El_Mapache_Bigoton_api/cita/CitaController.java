package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.Cliente;
import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.ClienteRepository;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/cita")
public class CitaController {

    @Autowired
    private CitaRepository citaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping()
    public ResponseEntity<Iterable<Cita>> findAll() {
        return ResponseEntity.ok(citaRepository.findAll());
    }

    @GetMapping("/usuario/{id}/citas")
    public List<Cita> getCitasPorUsuario(@PathVariable Long id) {
        return citaRepository.findByUsuarioIdUsuario(id);
    }

    @GetMapping("/{idCita}")
    public ResponseEntity<Cita> findById(@PathVariable Long idCita) {
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isPresent()) {
            return ResponseEntity.ok(citaOptional.get());
        }else{
            return ResponseEntity.notFound().build();
        }

    }

    // Crear nueva cita
    @PostMapping
    public ResponseEntity<Cita> create(@RequestBody Cita cita, UriComponentsBuilder uriBuilder) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(cita.getCliente().getIdCliente());
        if (clienteOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(cita.getUsuario().getIdUsuario());
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        cita.setCliente(clienteOptional.get());
        cita.setUsuario(usuarioOptional.get());
        Cita created = citaRepository.save(cita);
        URI uri = uriBuilder.path("cita/{idCita}").buildAndExpand(created.getIdCita()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    // Actualizar cita
    @PutMapping("/{idCita}")
    public ResponseEntity<Void> update(@PathVariable Long idCita, @RequestBody Cita cita) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(cita.getCliente().getIdCliente());
        if (clienteOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(cita.getUsuario().getIdUsuario());
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        Cita citaanterior = citaRepository.save(cita);
        if(citaanterior!=null){
            cita.setCliente(clienteOptional.get());
            cita.setUsuario(usuarioOptional.get());
            cita.setIdCita(citaanterior.getIdCita());
            citaRepository.save(cita);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();

    }

    // Eliminar cita
    @DeleteMapping("/{idCita}")
    public ResponseEntity<Void> delete(@PathVariable Long idCita) {
        if (citaRepository.findById(idCita).isPresent()) {
            citaRepository.deleteById(idCita);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Obtener servicios de una cita
    @GetMapping("/servicios/{idCita}")
    public ResponseEntity<Iterable<Cita_Servicio>>tCitaServicios(@PathVariable Long idCita) {
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isPresent()) {
            return ResponseEntity.ok(citaOptional.get().getCitaServicios());

        }
        return ResponseEntity.notFound().build();
    }

}

