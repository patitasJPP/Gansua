import { useCallback } from "react";
import { datosSemanaService } from "../../../Services/datosSemana";
import type {
  HabitoMarcado,
  MensajeResponse,
  SincronizacionRequest,
} from "../types/types";

const API_URL = "http://localhost:8080/api";

// Hook para sincronizar los cambios de la semana con el backend.
// Vias: apiService (axios, con respuesta) y sendBeacon (para cierre/reload).
export const useSincronizacion = () => {
  // Convierte las claves "dia-habitoId" en objetos { dia, habitoId }
  const clavesAObjetos = useCallback(
    (claves: string[]): HabitoMarcado[] => {
      return claves.map((clave) => {
        const [dia, id] = clave.split("-");
        return { dia, habitoId: parseInt(id, 10) };
      });
    },
    [],
  );

  // Compara lo guardado en localStorage (LS) con lo que hay en la BD.
  // LS solo guarda claves marcadas (true).
  const calcularCambios = useCallback(
    (completadosLS: Record<string, boolean>, completadosBD: Record<string, boolean>) => {
      const marcados = Object.keys(completadosLS).filter(
        (clave) => !completadosBD[clave],
      );
      const desmarcados = Object.keys(completadosBD).filter(
        (clave) => !completadosLS[clave],
      );
      return { marcados, desmarcados };
    },
    [],
  );

  // Sincronizacion principal con axios (espera respuesta del backend)
  const sincronizar = useCallback(
    async (semana: string, marcados: string[], desmarcados: string[]) => {
      const payload: SincronizacionRequest = {
        semana,
        marcados: clavesAObjetos(marcados),
        desmarcados: clavesAObjetos(desmarcados),
      };
      try {
        const response = await datosSemanaService.sincronizar<MensajeResponse>(
          payload,
        );
        console.log("Sincronizacion OK:", response);
        return { success: response.success, message: response.message };
      } catch (error) {
        console.error("Error sincronizando:", error);
        return { success: false, message: "Error al sincronizar" };
      }
    },
    [clavesAObjetos],
  );

  // Sincronizacion con sendBeacon: garantizada al cerrar/recargar, sin respuesta.
  const sincronizarBeacon = useCallback(
    (semana: string, marcados: string[], desmarcados: string[]) => {
      const payload: SincronizacionRequest = {
        semana,
        marcados: clavesAObjetos(marcados),
        desmarcados: clavesAObjetos(desmarcados),
      };
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      const enviado = navigator.sendBeacon(
        `${API_URL}/habitos/sincronizar`,
        blob,
      );
      console.log(
        enviado
          ? "sendBeacon: sincronizacion programada"
          : "sendBeacon: NO se pudo enviar",
      );
    },
    [clavesAObjetos],
  );

  return { calcularCambios, sincronizar, sincronizarBeacon };
};
