package com.backend.organisador.controllers;

import com.backend.organisador.entities.DatosSemana;
import com.backend.organisador.entities.HabitoMarcado;
import com.backend.organisador.entities.MensajeResponse;
import com.backend.organisador.entities.Periodo;
import com.backend.organisador.entities.SincronizacionRequest;
import com.backend.organisador.services.ServiciosDatosSemana;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.organisador.services.ServiceHabitos;
import  com.backend.organisador.entities.Habito;
import com.backend.organisador.services.PeriodoService;


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

            servicioDatosSemana.sincronizar(periodo, marcados, desmarcados);

            return ResponseEntity.ok(new MensajeResponse(true, "Sincronizado exitosamente"));
        } catch (Exception e) {
            System.out.println("== [CONTROLLER][ERROR] Fallo al sincronizar: " + e.getMessage() + " ==");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MensajeResponse(false, "Error al sincronizar: " + e.getMessage()));
        }
    }

}
