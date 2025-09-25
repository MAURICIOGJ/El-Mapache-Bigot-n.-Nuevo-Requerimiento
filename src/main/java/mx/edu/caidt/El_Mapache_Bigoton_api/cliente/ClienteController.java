package mx.edu.caidt.El_Mapache_Bigoton_api.cliente;

import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;
    @GetMapping()
    public ResponseEntity<Iterable<Cliente>> findAll() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    @GetMapping("/{idCliente}")
    public ResponseEntity<Cliente> findById(@PathVariable Long idCliente) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
        if (clienteOptional.isPresent()) {
            return ResponseEntity.ok(clienteOptional.get());
        }else{
            return ResponseEntity.notFound().build();
        }

    }

    // Crear nueva cita
    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente cliente, UriComponentsBuilder uriBuilder) {
        Cliente created = clienteRepository.save(cliente);
        URI uri = uriBuilder.path("cliente/{idCliente}").buildAndExpand(created.getIdCliente()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    // Actualizar cita
    @PutMapping("/{idCliente}")
    public ResponseEntity<Void> update(@PathVariable Long idCita, @RequestBody Cliente cliente) {
        Cliente clienteanterior = clienteRepository.save(cliente);
        if(clienteanterior!=null){
            cliente.setIdCliente(clienteanterior.getIdCliente());
            clienteRepository.save(cliente);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();

    }

    // Eliminar cita
    @DeleteMapping("/{idCliente}")
    public ResponseEntity<Void> delete(@PathVariable Long idCita) {
        if (clienteRepository.findById(idCita).isPresent()) {
            clienteRepository.deleteById(idCita);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Obtener la cita de un cliente
    @GetMapping("/cita/{idCliente}")
    public ResponseEntity<Iterable<Cita>> tCitas(@PathVariable Long idCliente) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
        if (clienteOptional.isPresent()) {
            return ResponseEntity.ok(clienteOptional.get().getCita());
        }
        return ResponseEntity.notFound().build();
    }
}

