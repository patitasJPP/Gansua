import { Check } from "lucide-react";
import { TEMAS, useTheme } from "./ThemeContext";

/** Selector de paletas de color: circulitos con la muestra de cada tema */
export const ThemeSwitcher = () => {
  const { tema, cambiarTema } = useTheme();

  return (
    <div className="flex items-center flex-wrap gap-2">
      {TEMAS.map((t) => {
        const activo = t.id === tema.id;
        return (
          <button
            key={t.id}
            type="button"
            title={t.nombre}
            aria-label={`Tema ${t.nombre}`}
            onClick={() => cambiarTema(t.id)}
            className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${
              activo ? "ring-2 ring-offset-2 ring-offset-brand-100 ring-brand-900 scale-110" : ""
            }`}
            style={{ backgroundColor: t.muestra }}
          >
            {activo && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
};
