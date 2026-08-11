package com.backend.organisador;

import com.backend.organisador.services.serviceHabitos;
import com.backend.organisador.services.serviceDias;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
public class DataLoader implements CommandLineRunner {

    private  final  serviceHabitos ServiceHabitos;
    private final serviceDias ServiceDias;
    public  DataLoader(serviceHabitos ServiceHabitos, serviceDias serviceDias) {
        this.ServiceHabitos=ServiceHabitos;

        ServiceDias = serviceDias;
    }


    @Override
    public void run(String... args) throws Exception {
        System.out.println(String.valueOf('/').repeat(50));
        System.out.println("\n========== MOSTRANDO HÁBITOS EN CONSOLA ==========\n");

        ServiceHabitos.ObtenerTodos().forEach(habito ->
                System.out.println(habito)
        );

        System.out.println("la cantidad de abitos que usten contiene es la siguiente: "+ ServiceHabitos.contadorHabitos());


        System.out.println("\n========== FIN ==========\n");
        System.out.println(String.valueOf('/').repeat(50));

        System.out.print(String.valueOf("/").repeat(50));
        System.out.print("  Estos son todos los dias que vas hacer tus abitos  ");
        System.out.print(String.valueOf("/").repeat(50));
        //contenido de lo que son los abitos

        ServiceDias.ObtenerTodo().forEach(dias -> System.out.println(dias));

        //final
        System.out.print(String.valueOf("/").repeat(50));
        System.out.print("  fin  ");
        System.out.print(String.valueOf("/").repeat(50));
    }
}
