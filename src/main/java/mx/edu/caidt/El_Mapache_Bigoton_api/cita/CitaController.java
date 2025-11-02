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

    private static final Long ID_BARBERO_FIJO = 1L;


    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ Servidor funcionando correctamente");
    }

    @PostMapping("/test-dto")
    public ResponseEntity<String> testDTO(@RequestBody String rawBody) {
        System.out.println("📦 RAW BODY RECIBIDO:");
        System.out.println(rawBody);
        return ResponseEntity.ok("Datos recibidos: " + rawBody);
    }

    @GetMapping()
    public ResponseEntity<Iterable<Cita>> findAll() {
        return ResponseEntity.ok(citaRepository.findAllWithEagerRelationships());
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


    @PostMapping
    public ResponseEntity<Cita> create(@RequestBody CitaCreationDTO citaDTO, UriComponentsBuilder uriBuilder) {
        // LOG: Ver qué está llegando
        System.out.println("========================================");
        System.out.println("📥 RECIBIENDO PETICIÓN POST /cita");
        System.out.println("DTO recibido: " + citaDTO);
        System.out.println("Fecha: " + citaDTO.fecha());
        System.out.println("Hora: " + citaDTO.hora());
        System.out.println("ID Cliente: " + citaDTO.idCliente());
        System.out.println("ID Servicios: " + citaDTO.idServicios());
        System.out.println("========================================");

        if (citaDTO.idCliente() == null) {
            System.err.println("❌ ERROR: idCliente es null");
            return ResponseEntity.badRequest().body(null);
        }
        Optional<Cliente> clienteOptional = clienteRepository.findById(citaDTO.idCliente());
        if (clienteOptional.isEmpty()) {
            return ResponseEntity.unprocessableEntity().body(null);
        }

        Optional<Usuario> usuarioOptional = usuarioRepository.findById(ID_BARBERO_FIJO);
        if (usuarioOptional.isEmpty()) {
            System.err.println("ERROR: El Barbero con ID " + ID_BARBERO_FIJO + " no existe.");
            return ResponseEntity.internalServerError().build();
        }

        Cita cita = new Cita();
        cita.setFecha(citaDTO.fecha());
        cita.setHora(citaDTO.hora());
        cita.setCliente(clienteOptional.get());
        cita.setUsuario(usuarioOptional.get());

        Cita citaGuardada = citaRepository.save(cita);

        // Guardar relaciones Cita-Servicio
        if (citaDTO.idServicios() != null && !citaDTO.idServicios().isEmpty()) {
            guardarServiciosDeCita(citaGuardada, citaDTO.idServicios());
        }

        URI uri = uriBuilder.path("cita/{idCita}").buildAndExpand(citaGuardada.getIdCita()).toUri();
        return ResponseEntity.created(uri).body(citaGuardada);
    }

    /**
     * Actualizar cita usando DTO
     */
    @PutMapping("/{idCita}")
    public ResponseEntity<Void> update(@PathVariable Long idCita, @RequestBody CitaCreationDTO citaDTO) {
        // Verificar si la cita existe
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Cita citaExistente = citaOptional.get();

        // Actualizar fecha y hora
        citaExistente.setFecha(citaDTO.fecha());
        citaExistente.setHora(citaDTO.hora());

        // Actualizar cliente si viene en el DTO
        if (citaDTO.idCliente() != null) {
            Optional<Cliente> clienteOpt = clienteRepository.findById(citaDTO.idCliente());
            if (clienteOpt.isEmpty()) {
                return ResponseEntity.unprocessableEntity().build();
            }
            citaExistente.setCliente(clienteOpt.get());
        }

        // Mantener o actualizar barbero
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(ID_BARBERO_FIJO);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.internalServerError().build();
        }
        citaExistente.setUsuario(usuarioOptional.get());

        // Guardar cita actualizada
        citaRepository.save(citaExistente);

        // Actualizar servicios si se enviaron
        if (citaDTO.idServicios() != null) {
            // Eliminar relaciones anteriores usando el nuevo método
            citaServicioRepository.deleteByCitaIdCita(idCita);

            // Crear nuevas relaciones
            guardarServiciosDeCita(citaExistente, citaDTO.idServicios());
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Eliminar cita (elimina automáticamente las relaciones Cita-Servicio por CASCADE)
     */
    @DeleteMapping("/{idCita}")
    public ResponseEntity<Void> delete(@PathVariable Long idCita) {
        System.out.println("========================================");
        System.out.println("🗑️ DELETE /cita/" + idCita);

        try {
            Optional<Cita> citaOptional = citaRepository.findById(idCita);

            if (citaOptional.isEmpty()) {
                System.err.println("❌ Cita no encontrada: " + idCita);
                return ResponseEntity.notFound().build();
            }

            // Debido a cascade = CascadeType.ALL en la entidad Cita,
            // esto eliminará automáticamente los registros en cita_servicio
            citaRepository.deleteById(idCita);

            System.out.println("✅ Cita eliminada correctamente: " + idCita);
            System.out.println("========================================");
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            System.err.println("❌ ERROR al eliminar cita " + idCita);
            System.err.println("Mensaje: " + e.getMessage());
            System.err.println("Tipo: " + e.getClass().getName());
            e.printStackTrace();
            System.err.println("========================================");
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Obtener servicios de una cita
     */
    @GetMapping("/servicios/{idCita}")
    public ResponseEntity<Iterable<Cita_Servicio>> getCitaServicios(@PathVariable Long idCita) {
        Optional<Cita> citaOptional = citaRepository.findById(idCita);
        if (citaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Cita_Servicio> citaServicios = citaServicioRepository.findByCitaIdCita(idCita);
        return ResponseEntity.ok(citaServicios);
    }

    /**
     * Método auxiliar para guardar las relaciones Cita-Servicio
     */
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