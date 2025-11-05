package mx.edu.caidt.El_Mapache_Bigoton_api.cita;

import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.Cita_Servicio.Cita_ServicioRepository;
import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.Cliente;
import mx.edu.caidt.El_Mapache_Bigoton_api.cliente.ClienteRepository;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.Servicio;
import mx.edu.caidt.El_Mapache_Bigoton_api.servicio.ServicioRepository;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.Usuario;
import mx.edu.caidt.El_Mapache_Bigoton_api.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
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
    @Autowired
    private ServicioRepository servicioRepository;
    @Autowired
    private Cita_ServicioRepository citaServicioRepository;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ Servidor funcionando");
    }

    /**
     * Obtener SOLO citas programadas ordenadas por fecha/hora
     */
    @GetMapping()
    public ResponseEntity<Iterable<Cita>> findAll() {
        return ResponseEntity.ok(citaRepository.findCitasProgramadasOrdenadas());
    }

    /**
     * Obtener historial de citas COMPLETADAS
     */
    @GetMapping("/completadas")
    public ResponseEntity<List<Cita>> getCitasCompletadas() {
        return ResponseEntity.ok(citaRepository.findCitasCompletadas());
    }

    /**
     * Obtener citas CANCELADAS
     */
    @GetMapping("/canceladas")
    public ResponseEntity<List<Cita>> getCitasCanceladas() {
        return ResponseEntity.ok(citaRepository.findCitasCanceladas());
    }

    @GetMapping("/usuario/{id}/citas")
    public List<Cita> getCitasPorUsuario(@PathVariable Long id) {
        return citaRepository.findByUsuarioIdUsuario(id);
    }

    @GetMapping("/{idCita}")
    public ResponseEntity<Cita> findById(@PathVariable Long idCita) {
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        return citaOptional.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crear nueva cita (siempre estado PROGRAMADA)
     */
    @PostMapping
    public ResponseEntity<Cita> create(@RequestBody CitaCreationDTO citaDTO, UriComponentsBuilder uriBuilder) {
        System.out.println("📥 POST /cita - " + citaDTO);

        if (citaDTO.idCliente() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Optional<Cliente> clienteOptional = clienteRepository.findById(citaDTO.idCliente());
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.unprocessableEntity().body(null);
        }

        Long idBarbero = citaDTO.idUsuario() != null ? citaDTO.idUsuario() : 1L;
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(idBarbero);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.unprocessableEntity().body(null);
        }

        Cita cita = new Cita();
        cita.setFecha(citaDTO.fecha());
        cita.setHora(citaDTO.hora());
        cita.setCliente(clienteOptional.get());
        cita.setUsuario(usuarioOptional.get());
        cita.setEstado("PROGRAMADA");

        Cita citaGuardada = citaRepository.save(cita);

        if (citaDTO.idServicios() != null && !citaDTO.idServicios().isEmpty()) {
            guardarServiciosDeCita(citaGuardada, citaDTO.idServicios());
        }

        System.out.println("✅ Cita creada: " + citaGuardada.getIdCita());
        URI uri = uriBuilder.path("cita/{idCita}").buildAndExpand(citaGuardada.getIdCita()).toUri();
        return ResponseEntity.created(uri).body(citaGuardada);
    }

    @PutMapping("/{idCita}")
    public ResponseEntity<Void> update(@PathVariable Long idCita, @RequestBody CitaCreationDTO citaDTO) {
        System.out.println("📝 PUT /cita/" + idCita);

        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cita citaExistente = citaOptional.get();
        citaExistente.setFecha(citaDTO.fecha());
        citaExistente.setHora(citaDTO.hora());

        if (citaDTO.idCliente() != null) {
            Optional<Cliente> clienteOpt = clienteRepository.findById(citaDTO.idCliente());
            if (clienteOpt.isEmpty()) {
                return ResponseEntity.unprocessableEntity().build();
            }
            citaExistente.setCliente(clienteOpt.get());
        }

        if (citaDTO.idUsuario() != null) {
            Optional<Usuario> usuarioOptional = usuarioRepository.findById(citaDTO.idUsuario());
            if (usuarioOptional.isEmpty()) {
                return ResponseEntity.unprocessableEntity().build();
            }
            citaExistente.setUsuario(usuarioOptional.get());
        }

        citaRepository.save(citaExistente);

        if (citaDTO.idServicios() != null) {
            citaServicioRepository.deleteByCitaIdCita(idCita);
            guardarServiciosDeCita(citaExistente, citaDTO.idServicios());
        }

        System.out.println("✅ Cita actualizada");
        return ResponseEntity.ok().build();
    }

    /**
     * MARCAR CITA COMO COMPLETADA
     */
    @PutMapping("/{idCita}/completar")
    public ResponseEntity<Void> completarCita(@PathVariable Long idCita) {
        System.out.println("✅ Completando cita: " + idCita);

        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cita cita = citaOptional.get();
        cita.setEstado("COMPLETADA");
        cita.setFechaCompletada(LocalDateTime.now());
        citaRepository.save(cita);

        return ResponseEntity.ok().build();
    }

    /**
     * MARCAR CITA COMO CANCELADA (con motivo)
     */
    @PutMapping("/{idCita}/cancelar")
    public ResponseEntity<Void> cancelarCita(@PathVariable Long idCita, @RequestBody String motivo) {
        System.out.println("❌ Cancelando cita: " + idCita + " - Motivo: " + motivo);

        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cita cita = citaOptional.get();
        cita.setEstado("CANCELADA");
        cita.setMotivoCancelacion(motivo);
        cita.setFechaCompletada(LocalDateTime.now());
        citaRepository.save(cita);

        return ResponseEntity.ok().build();
    }

    /**
     * ELIMINAR permanentemente (solo si es necesario)
     */
    @DeleteMapping("/{idCita}")
    public ResponseEntity<Void> delete(@PathVariable Long idCita) {
        System.out.println("🗑️ DELETE /cita/" + idCita);

        try {
            if (citaRepository.findById(idCita).isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            citaRepository.deleteById(idCita);
            System.out.println("✅ Cita eliminada permanentemente");
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            System.err.println("❌ ERROR: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/servicios/{idCita}")
    public ResponseEntity<Iterable<Cita_Servicio>> getCitaServicios(@PathVariable Long idCita) {
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Cita_Servicio> citaServicios = citaServicioRepository.findByCitaIdCita(idCita);
        return ResponseEntity.ok(citaServicios);
    }

    private void guardarServiciosDeCita(Cita cita, List<Long> idServicios) {
        for (Long idServicio : idServicios) {
            Optional<Servicio> servicioOpt = servicioRepository.findById(idServicio);
            if (servicioOpt.isPresent()) {
                Cita_Servicio citaServicio = new Cita_Servicio();
                citaServicio.setCita(cita);
                citaServicio.setServicio(servicioOpt.get());
                citaServicioRepository.save(citaServicio);
            }
        }
    }
}