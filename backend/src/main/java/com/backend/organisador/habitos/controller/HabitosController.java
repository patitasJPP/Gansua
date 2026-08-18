package com.backend.organisador.habitos.controller;
import com.backend.organisador.habitos.entities.HabitoMarcado;
import com.backend.organisador.habitos.entities.MensajeResponse;
import com.backend.organisador.habitos.entities.SincronizacionRequest;
import com.backend.organisador.habitos.entities.DatosSemana;
import com.backend.organisador.habitos.services.ServiciosDatosSemana;
import com.backend.organisador.habitos.entities.Habito;
import com.backend.organisador.habitos.services.ServiceHabitos;
import com.backend.organisador.habitos.entities.Periodo;
import com.backend.organisador.habitos.services.PeriodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/habitos")
@CrossOrigin(origins = "*")
public class HabitosController {

    @Autowired
    private ServiceHabitos servicioHabitos;
    @Autowired
    private ServiciosDatosSemana servicioDatosSemana;

    @Autowired
    private PeriodoService servicioPeriodo;


    @GetMapping
    public List<Habito> obtenerTodo(){
   return servicioHabitos.obtenerTodos();
    }

    @PostMapping
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> crearHabito(@RequestBody Habito habitos){
        try {
            boolean esAbstinencia = Boolean.TRUE.equals(habitos.getEsAbstinencia());
            Habito nuevo = servicioHabitos.crearHabito(habitos.getHabitos(), esAbstinencia);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MensajeResponse(false, "Error al crear el habito: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<MensajeResponse> eliminarHabito(@PathVariable Long id){
        try {
            servicioHabitos.eliminarHabito(id);
            return ResponseEntity.ok(new MensajeResponse(true, "Habito eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MensajeResponse(false, "Error al eliminar el habito: " + e.getMessage()));
        }
    }


    @GetMapping("/datos_semana")
    @CrossOrigin(origins = "*")
    public List<DatosSemana> obtenerDatosSemana(){
        Periodo periodo = servicioPeriodo.obtenerOCrearSemana(LocalDateTime.now());
        return servicioDatosSemana.obtenerDatosSemana(periodo.getSemana());
    }

    @PostMapping("/sincronizar")
    @CrossOrigin(origins = "*")
    public ResponseEntity<MensajeResponse> sincronizar(@RequestBody SincronizacionRequest request){
        try {
            Periodo periodo = servicioPeriodo.obtenerOCrearSemana(LocalDateTime.now());

            List<HabitoMarcado> marcados = request.getMarcados();
            List<HabitoMarcado> desmarcados = request.getDesmarcados();

            int totalEnviados = (marcados != null ? marcados.size() : 0) + (desmarcados != null ? desmarcados.size() : 0);
            int cambios = servicioDatosSemana.sincronizar(periodo, marcados, desmarcados);

            if (totalEnviados > 0 && cambios == 0) {
                System.out.println("== [CONTROLLER][WARN] Se enviaron " + totalEnviados + " cambios pero ninguno se guardo ==");
                return ResponseEntity.ok(new MensajeResponse(false, "Ningun cambio se pudo guardar. Verifica que los dias y habitos existan en la BD."));
            }

            return ResponseEntity.ok(new MensajeResponse(true, "Sincronizado exitosamente (" + cambios + " cambios)"));
        } catch (Exception e) {
            System.out.println("== [CONTROLLER][ERROR] Fallo al sincronizar: " + e.getMessage() + " ==");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MensajeResponse(false, "Error al sincronizar: " + e.getMessage()));
        }
    }

}
