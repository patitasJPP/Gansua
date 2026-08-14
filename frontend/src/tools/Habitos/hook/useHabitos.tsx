import React, { useCallback, useEffect } from "react";
import type { Habito } from "../types/types";
import { apiService } from "../../../Services/Data";

export const useHabitos = () => {
  const [habito, setHabito] = React.useState<Habito[]>([]);
  const [cargando, setCargando] = React.useState(true);

  const refrescar = useCallback(async () => {
    setCargando(true);
    try {
      const response = await apiService.get<Habito[]>("habitos");
      console.log("Habitos actualizados:", response);
      setHabito(response);
    } catch (error) {
      console.error("Error al refrescar los hábitos:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const ObetenerHabitos = async () => {
      await refrescar();
    };

    ObetenerHabitos();
  }, [refrescar]);

  return [habito, refrescar, cargando] as const;
};
