package mx.edu.caidt.El_Mapache_Bigoton_api.servicio;

import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/servicio")
public class ServicioController {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private CitaRepository citaRepository;

    @GetMapping()
    public ResponseEntity<Iterable<Servicio>> findAll() {
        return ResponseEntity.ok(servicioRepository.findAll());
    }

    @GetMapping("/{idServicio}")
    public ResponseEntity<Servicio> findById(@PathVariable Long idServicio) {
        Optional<Servicio> servicioOptional = servicioRepository.findById(idServicio);
        if (servicioOptional.isPresent()) {
            return ResponseEntity.ok(servicioOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Servicio> create(@RequestBody Servicio servicio, UriComponentsBuilder uriBuilder) {
        Optional<Cita> citaOptional = citaRepository.findById(servicio.getCita().getIdCita());
        if (!citaOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        servicio.setCita(citaOptional.get());

        Servicio created = servicioRepository.save(servicio);
        URI uri = uriBuilder.path("servicio/{idServicio}").buildAndExpand(created.getIdServicio()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{idServicio}")
    public ResponseEntity<Void> update(@PathVariable Long idServicio, @RequestBody Servicio servicio) {
        Optional<Cita> citaOptional = citaRepository.findById(servicio.getCita().getIdCita());

        if (!citaOptional.isPresent() ) {
            return ResponseEntity.unprocessableEntity().build();
        }

        Servicio servicioAnterior = servicioRepository.findById(idServicio).orElse(null);
        if (servicioAnterior != null) {
            servicio.setCita(citaOptional.get());
            servicio.setIdServicio(servicioAnterior.getIdServicio());
            servicioRepository.save(servicio);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{idServicio}")
    public ResponseEntity<Void> delete(@PathVariable Long idServicio) {
        if (servicioRepository.findById(idServicio).isPresent()) {
            servicioRepository.deleteById(idServicio);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Obtener la cita de un servicio
    @GetMapping("/cita/{idServicio}")
    public ResponseEntity<Cita> getCita(@PathVariable Long idServicio) {
        Optional<Servicio> servicioOptional = servicioRepository.findById(idServicio);
        if (servicioOptional.isPresent()) {
            return ResponseEntity.ok(servicioOptional.get().getCita());
        }
        return ResponseEntity.notFound().build();
    }
}

