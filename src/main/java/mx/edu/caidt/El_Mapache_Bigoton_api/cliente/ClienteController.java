package mx.edu.caidt.El_Mapache_Bigoton_api.cliente;

import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/cliente")
public class ClienteController {
    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public ResponseEntity<Iterable<Cliente>> findAll() {
        return ResponseEntity.ok(clienteRepository.findAll());
    }

    @GetMapping("/{idCliente}")
    public ResponseEntity<Cliente> findById(@PathVariable Long idCliente) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
        if (clienteOptional.isPresent()) {
            return ResponseEntity.ok(clienteOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente cliente, UriComponentsBuilder uriBuilder) {
        Cliente created = clienteRepository.save(cliente);
        URI uri = uriBuilder.path("/cliente/{idCliente}").buildAndExpand(created.getIdCliente()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{idCliente}")
    public ResponseEntity<Void> update(@PathVariable Long idCliente, @RequestBody Cliente cliente) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);

        if (!clienteOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        cliente.setIdCliente(idCliente);
        clienteRepository.save(cliente);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idCliente}")
    public ResponseEntity<Void> delete(@PathVariable Long idCliente) {
        if (clienteRepository.findById(idCliente).isPresent()) {
            clienteRepository.deleteById(idCliente);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/cita/{idCliente}")
    public ResponseEntity<Cita> tCita(@PathVariable Long idCliente) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);
        if (clienteOptional.isPresent()) {
            return ResponseEntity.ok(clienteOptional.get().getCita());
        }
        return ResponseEntity.notFound().build();
    }

}
