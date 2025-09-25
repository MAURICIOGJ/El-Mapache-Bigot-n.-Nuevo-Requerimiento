package mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio;

import mx.edu.caidt.El_Mapache_Bigoton_api.cita.Cita;
import mx.edu.caidt.El_Mapache_Bigoton_api.cita.CitaRepository;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/citaservicio")
public class Cita_ServicioController {

    @Autowired
    private Cita_ServicioRepository citaServicioRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @GetMapping()
    public ResponseEntity<Iterable<Cita_Servicio>> findAll() {
        return ResponseEntity.ok(citaServicioRepository.findAll());
    }

    @GetMapping("/{idCitaServicio}")
    public ResponseEntity<Cita_Servicio> findById(@PathVariable Long idCitaServicio) {
        return citaServicioRepository.findById(idCitaServicio)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear nueva relación Cita-Servicio
    @PostMapping
    public ResponseEntity<Cita_Servicio> create(@RequestBody Cita_Servicio cita_servicio, UriComponentsBuilder uriBuilder) {
        Optional<Cita> citaOptional = citaRepository.findById(cita_servicio.getCita().getIdCita());
        if (!citaOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        Optional<Servicio> servicioOptional = servicioRepository.findById(cita_servicio.getServicio().getIdServicio());
        if (!servicioOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        cita_servicio.setCita(citaOptional.get());
        cita_servicio.setServicio(servicioOptional.get());

        Cita_Servicio created = citaServicioRepository.save(cita_servicio);
        URI uri = uriBuilder.path("/citaservicio/{idCitaServicio}").buildAndExpand(created.getIdCitaServicio()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    // Actualizar relación Cita-Servicio
    @PutMapping("/{idCitaServicio}")
    public ResponseEntity<Void> update(@PathVariable Long idCitaServicio, @RequestBody Cita_Servicio cita_servicio) {
        Optional<Cita_Servicio> existente = citaServicioRepository.findById(idCitaServicio);
        if (!existente.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Cita> citaOptional = citaRepository.findById(cita_servicio.getCita().getIdCita());
        Optional<Servicio> servicioOptional = servicioRepository.findById(cita_servicio.getServicio().getIdServicio());

        if (!citaOptional.isPresent() || !servicioOptional.isPresent()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        cita_servicio.setIdCitaServicio(idCitaServicio);
        cita_servicio.setCita(citaOptional.get());
        cita_servicio.setServicio(servicioOptional.get());

        citaServicioRepository.save(cita_servicio);
        return ResponseEntity.ok().build();
    }

    // Eliminar relación
    @DeleteMapping("/{idCitaServicio}")
    public ResponseEntity<Void> delete(@PathVariable Long idCitaServicio) {
        if (citaServicioRepository.findById(idCitaServicio).isPresent()) {
            citaServicioRepository.deleteById(idCitaServicio);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}


