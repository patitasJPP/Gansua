import { useCallback } from "react";

// Hook para manejar el estado de habitos completados en localStorage.
// Guarda solo las claves marcadas (true) por semana.
export const useHabitosLocalStorage = () => {
  const obtenerKey = (semana: string) => `habitos_completados_${semana}`;

  const cargar = useCallback(
    (semana: string): Record<string, boolean> => {
      const stored = localStorage.getItem(obtenerKey(semana));
      if (!stored) return {};
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error al leer localStorage:", error);
        return {};
      }
    },
    [],
  );

  const guardar = useCallback(
    (semana: string, completados: Record<string, boolean>) => {
      // solo se guardan las claves marcadas (true)
      const soloMarcados: Record<string, boolean> = {};
      Object.entries(completados).forEach(([clave, marcado]) => {
        if (marcado) soloMarcados[clave] = true;
      });
      localStorage.setItem(obtenerKey(semana), JSON.stringify(soloMarcados));
    },
    [],
  );

  const limpiar = useCallback(
    (semana: string) => {
      localStorage.removeItem(obtenerKey(semana));
    },
    [],
  );

  return { cargar, guardar, limpiar };
};
