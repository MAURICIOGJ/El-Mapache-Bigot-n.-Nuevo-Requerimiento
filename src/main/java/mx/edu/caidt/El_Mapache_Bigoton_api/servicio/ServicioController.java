package mx.edu.caidt.El_Mapache_Bigoton_api.servicio;

import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/servicio")
public class ServicioController {
     @Autowired
     private ServicioRepository servicioRepository;


    @GetMapping()
    public ResponseEntity<Iterable<Servicio>> findAll() {
        return ResponseEntity.ok(servicioRepository.findAll());
    }

    @GetMapping("/{idServicio}")
    public ResponseEntity<Servicio> findById(@PathVariable Long idServicio) {
        Optional<Servicio> servicioOptional = servicioRepository.findById(idServicio);
        if(servicioOptional.isPresent()) {
            return ResponseEntity.ok(servicioOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Servicio> create(@RequestBody Servicio servicio, UriComponentsBuilder uriBuilder) {
        Servicio created = servicioRepository.save(servicio);
        URI uri = uriBuilder.path("/servicios/{idServicio}")
                .buildAndExpand(created.getIdServicio())
                .toUri();
        return ResponseEntity.created(uri).body(created);
    }

    // Actualizar servicio
    @PutMapping("/{idServicio}")
    public ResponseEntity<Servicio> update(@PathVariable Long idServicio, @RequestBody Servicio servicio) {
        Servicio servicioAnterior = servicioRepository.findById(idServicio).get();
        if (servicioAnterior!=null) {
            servicio.setIdServicio(servicioAnterior.getIdServicio());
            servicioRepository.save(servicio);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Eliminar servicio
    @DeleteMapping("/{idServicio}")
    public ResponseEntity<Void> delete(@PathVariable Long idServicio) {
        if (servicioRepository.findById(idServicio).isPresent()) {
            servicioRepository.deleteById(idServicio);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Obtener detalles de un servicio (servicios asociados si los hubiera)
    @GetMapping("/cita/{idServicio}")
    public ResponseEntity<Iterable<Cita_Servicio>>tCitaServicios(@PathVariable Long idServicio) {
        Optional<Servicio> servicioOptional = servicioRepository.findById(idServicio);
        if (servicioOptional.isPresent()) {
            return ResponseEntity.ok(servicioOptional.get().getCitaServicios());

        }
        return ResponseEntity.notFound().build();
    }
}

