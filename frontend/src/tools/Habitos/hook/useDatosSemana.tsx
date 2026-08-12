import React, { useEffect } from "react";
import type { DatoSemana } from "../types/types";
import { datosSemanaService } from "../../../Services/datosSemana";

export const useDatosSemana = () => {
  const [datosSemana, setDatosSemana] = React.useState<DatoSemana[]>([]);

  useEffect(() => {
    const ObtenerDatosSemana = async () => {
      try {
        const response = await datosSemanaService.getDatosSemana<DatoSemana[]>();
        console.log("Datos de la semana recibidos:", response);
        setDatosSemana(response);
      } catch (error) {
        console.error("Error al obtener los datos de la semana:", error);
      }
    };

    ObtenerDatosSemana();
  }, []);

  return [datosSemana];
};
