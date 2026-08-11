import React, { useEffect } from "react";
import type { DatoSemana } from "../types/types";
import { datosSemanaService } from "../../../Services/datosSemana";

export const useDatosSemana = (fecha: string) => {
  const [datosSemana, setDatosSemana] = React.useState<DatoSemana[]>([]);

  useEffect(() => {
    const ObtenerDatosSemana = async () => {
      try {
        const response = await datosSemanaService.getDatosSemana<DatoSemana[]>(
          fecha
        );
        console.log("Datos de la semana recibidos:", response);
        setDatosSemana(response);
      } catch (error) {
        console.error("Error al obtener los datos de la semana:", error);
      }
    };

    ObtenerDatosSemana();
  }, [fecha]);

  return [datosSemana];
};
