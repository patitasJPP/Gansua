import React, { useCallback, useEffect } from "react";
import type { DatoSemana } from "../types/types";
import { datosSemanaService } from "../../../Services/datosSemana";

// Guard de deduplicación: si ya hay una petición en curso (p. ej. por el doble
// mount de StrictMode en dev), las demás esperan la misma promesa en lugar de
// disparar otro GET y causar una doble inserción en el backend.
let datosSemanaInFlight: Promise<DatoSemana[]> | null = null;

export const useDatosSemana = () => {
  const [datosSemana, setDatosSemana] = React.useState<DatoSemana[]>([]);

  const refrescar = useCallback(async () => {
    try {
      if (!datosSemanaInFlight) {
        datosSemanaInFlight = datosSemanaService.getDatosSemana<DatoSemana[]>();
      }
      const response = await datosSemanaInFlight;
      console.log("Datos de la semana actualizados:", response);
      setDatosSemana(response);
    } catch (error) {
      console.error("Error al refrescar los datos de la semana:", error);
    } finally {
      datosSemanaInFlight = null;
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
