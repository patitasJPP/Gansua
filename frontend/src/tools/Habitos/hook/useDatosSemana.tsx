import React, { useCallback, useEffect } from "react";
import type { DatoSemana } from "../types/types";
import { datosSemanaService } from "../../../Services/datosSemana";

export const useDatosSemana = () => {
  const [datosSemana, setDatosSemana] = React.useState<DatoSemana[]>([]);

  const refrescar = useCallback(async () => {
    try {
      const response =
        await datosSemanaService.getDatosSemana<DatoSemana[]>();
      console.log("Datos de la semana actualizados:", response);
      setDatosSemana(response);
    } catch (error) {
      console.error("Error al refrescar los datos de la semana:", error);
    }
  }, []);

  useEffect(() => {
    const ObtenerDatosSemana = async () => {
      await refrescar();
    };

    ObtenerDatosSemana();
  }, [refrescar]);

  return [datosSemana, refrescar] as const;
};
