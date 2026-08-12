import React, { useCallback, useEffect } from "react";
import type { Habito } from "../types/types";
import { apiService } from "../../../Services/Data";

export const useHabitos = () => {
  const [habito, setHabito] = React.useState<Habito[]>([]);

  const refrescar = useCallback(async () => {
    try {
      const response = await apiService.get<Habito[]>("habitos");
      console.log("Habitos actualizados:", response);
      setHabito(response);
    } catch (error) {
      console.error("Error al refrescar los hábitos:", error);
    }
  }, []);

  useEffect(() => {
    const ObetenerHabitos = async () => {
      await refrescar();
    };

    ObetenerHabitos();
  }, [refrescar]);

  return [habito, refrescar] as const;
};
