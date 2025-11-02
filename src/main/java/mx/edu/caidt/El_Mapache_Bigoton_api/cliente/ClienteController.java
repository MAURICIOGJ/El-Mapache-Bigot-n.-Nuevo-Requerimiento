package mx.edu.caidt.El_Mapache_Bigoton_api.cliente;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        return clienteOptional.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody ClienteUpdateDTO clienteDTO, UriComponentsBuilder uriBuilder) {
        try {
            // Crear nuevo cliente desde DTO
            Cliente nuevoCliente = new Cliente();
            nuevoCliente.setNombre(clienteDTO.nombre().trim());
            nuevoCliente.setTelefono(clienteDTO.telefono().trim());

            Cliente created = clienteRepository.save(nuevoCliente);

            URI uri = uriBuilder.path("/cliente/{idCliente}")
                    .buildAndExpand(created.getIdCliente())
                    .toUri();

            return ResponseEntity.created(uri).body(created);
        } catch (Exception e) {
            System.err.println("❌ Error al crear cliente: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{idCliente}")
    public ResponseEntity<Cliente> update(@PathVariable Long idCliente, @RequestBody ClienteUpdateDTO clienteDTO) {
        System.out.println("========================================");
        System.out.println("📝 PUT /cliente/" + idCliente);
        System.out.println("DTO recibido: " + clienteDTO);

        try {
            Optional<Cliente> clienteOptional = clienteRepository.findById(idCliente);

            if (clienteOptional.isEmpty()) {
                System.err.println("❌ Cliente no encontrado: " + idCliente);
                return ResponseEntity.notFound().build();
            }

            Cliente clienteExistente = clienteOptional.get();

            // Actualizar solo nombre y teléfono
            if (clienteDTO.nombre() != null && !clienteDTO.nombre().trim().isEmpty()) {
                clienteExistente.setNombre(clienteDTO.nombre().trim());
            }

            if (clienteDTO.telefono() != null && !clienteDTO.telefono().trim().isEmpty()) {
                clienteExistente.setTelefono(clienteDTO.telefono().trim());
            }

            // Guardar solo el cliente, JPA no tocará las citas por ausencia de cascade
            Cliente updated = clienteRepository.save(clienteExistente);

            System.out.println("✅ Cliente actualizado: " + updated.getIdCliente());
            System.out.println("========================================");

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            System.err.println("❌ ERROR CRÍTICO al actualizar cliente " + idCliente);
            System.err.println("Mensaje: " + e.getMessage());
            System.err.println("Tipo: " + e.getClass().getName());
            e.printStackTrace();
            System.err.println("========================================");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{idCliente}")
    public ResponseEntity<Void> delete(@PathVariable Long idCliente) {
        try {
            if (!clienteRepository.existsById(idCliente)) {
                return ResponseEntity.notFound().build();
            }

            clienteRepository.deleteById(idCliente);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            System.err.println("❌ Error al eliminar cliente: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}