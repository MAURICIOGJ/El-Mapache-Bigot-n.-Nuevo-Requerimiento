package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.Cliente;
import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.ClienteRepository;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

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

    @GetMapping("/{idCita}")
    public ResponseEntity<Cita> findById(@PathVariable Long idCita) {
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isPresent()) {
            return ResponseEntity.ok(citaOptional.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Cita> create(@RequestBody Cita cita, UriComponentsBuilder uriBuilder) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(cita.getUsuario().getIdUsuario());
        if (!usuarioOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        Optional<Cliente> clienteOptional = clienteRepository.findById(cita.getCliente().getIdCliente());
        if (!clienteOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        cita.setCliente(clienteOptional.get());
        cita.setUsuario(usuarioOptional.get());
        Cita created = citaRepository.save(cita);
        URI uri = uriBuilder.path("cita/{idCita}").buildAndExpand(created.getIdCita()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{idCita}")
    public ResponseEntity<Void> update(@PathVariable Long idCita, @RequestBody Cita cita) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(cita.getUsuario().getIdUsuario());
        Optional<Cliente> clienteOptional = clienteRepository.findById(cita.getCliente().getIdCliente());

        if (!usuarioOptional.isPresent() || !clienteOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }
        Cita citaAnterior = citaRepository.findById(idCita).get();
        if(citaAnterior !=null) {
            cita.setUsuario(usuarioOptional.get());
            cita.setCliente(clienteOptional.get());
            cita.setIdCita(citaAnterior.getIdCita());
            citaRepository.save(cita);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idCita}")
    public ResponseEntity<Void> delete(@PathVariable Long idCita) {
        if(citaRepository.findById(idCita).isPresent()) {
            citaRepository.deleteById(idCita);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    //obtener los servicios de una cita
    @GetMapping("/servicios/{idCita}")
    public ResponseEntity<Iterable<Servicio>> tServicio(@PathVariable Long idCita) {
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isPresent()) {
            return ResponseEntity.ok(citaOptional.get().getServicios());

        }
        return ResponseEntity.notFound().build();
    }


}
