/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Tema = {
  id: string;
  nombre: string;
  muestra: string;
};

export const TEMAS: Tema[] = [
  { id: "esmeralda", nombre: "Esmeralda", muestra: "#10b981" },
  { id: "azul", nombre: "Azul", muestra: "#3b82f6" },
  { id: "violeta", nombre: "Violeta", muestra: "#8b5cf6" },
  { id: "fucsia", nombre: "Fucsia", muestra: "#d946ef" },
  { id: "rosa", nombre: "Rosa", muestra: "#f43f5e" },
  { id: "ambar", nombre: "Ámbar", muestra: "#f59e0b" },
  { id: "teal", nombre: "Teal", muestra: "#14b8a6" },
];

type ThemeContextType = {
  tema: Tema;
  cambiarTema: (id: string) => void;
};

const CLAVE_LOCAL = "organisador-tema";

const ThemeContext = createContext<ThemeContextType | null>(null);

const leerTemaInicial = (): Tema => {
  try {
    const guardado = localStorage.getItem(CLAVE_LOCAL);
    if (guardado) {
      const encontrado = TEMAS.find((t) => t.id === guardado);
      if (encontrado) return encontrado;
    }
  } catch {
    // localStorage no disponible
  }
  return TEMAS[0];
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [tema, setTema] = useState<Tema>(leerTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema.id);
    try {
      localStorage.setItem(CLAVE_LOCAL, tema.id);
    } catch {
      // sin persistencia
    }
  }, [tema]);

  const cambiarTema = useCallback((id: string) => {
    const encontrado = TEMAS.find((t) => t.id === id);
    if (encontrado) setTema(encontrado);
  }, []);

  const valor = useMemo(() => ({ tema, cambiarTema }), [tema, cambiarTema]);

  return (
    <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return contexto;
};

/** Lee el valor actual de una variable CSS del tema (p. ej. para gráficas) */
export const useCssColor = (variable: string): string => {
  useTheme();
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || "";
};
