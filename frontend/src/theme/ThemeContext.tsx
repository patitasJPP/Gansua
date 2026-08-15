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
  /** Color primario (botones, headers, elementos principales) */
  muestra: string;
  /** Color secundario (acentos) */
  secundario: string;
};

export const TEMAS: Tema[] = [
  { id: "esmeralda", nombre: "Esmeralda", muestra: "#059669", secundario: "#14b8a6" },
  { id: "azul", nombre: "Océano", muestra: "#2563eb", secundario: "#06b6d4" },
  { id: "violeta", nombre: "Violeta", muestra: "#7c3aed", secundario: "#ec4899" },
  { id: "fucsia", nombre: "Fucsia", muestra: "#c026d3", secundario: "#8b5cf6" },
  { id: "rosa", nombre: "Rosa", muestra: "#e11d48", secundario: "#f59e0b" },
  { id: "ambar", nombre: "Ámbar", muestra: "#d97706", secundario: "#0d9488" },
  { id: "teal", nombre: "Teal", muestra: "#0d9488", secundario: "#3b82f6" },
  { id: "naturaleza", nombre: "Naturaleza", muestra: "#4d7c0f", secundario: "#ca8a04" },
  { id: "atardecer", nombre: "Atardecer", muestra: "#ea580c", secundario: "#be123c" },
  { id: "minimalista", nombre: "Minimalista", muestra: "#334155", secundario: "#94a3b8" },
];

/** Configuración del fondo del sidebar */
export type FondoPersonalizacion = {
  /** Valor CSS de background-image: "" (ninguno), gradiente o dataURL de imagen */
  imagen: string;
  /** Opacidad de la imagen (0..1) */
  opacidad: number;
  /** Escala / zoom (1..2) */
  escala: number;
  /** Posición del fondo (center, top, bottom, left, right...) */
  posicion: string;
};

const FONDO_DEFECTO: FondoPersonalizacion = {
  imagen: "",
  opacidad: 0.45,
  escala: 1.2,
  posicion: "center",
};

export type ThemeContextType = {
  tema: Tema;
  cambiarTema: (id: string) => void;
  fondo: FondoPersonalizacion;
  setFondo: (fondo: FondoPersonalizacion) => void;
  resetearFondo: () => void;
  exportarConfiguracion: () => void;
  importarConfiguracion: (contenido: string) => boolean;
};

const CLAVE_LOCAL = "organisador-tema";
const CLAVE_FONDO = "organisador-fondo";

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

const leerFondoInicial = (): FondoPersonalizacion => {
  try {
    const guardado = localStorage.getItem(CLAVE_FONDO);
    if (guardado) {
      const datos = JSON.parse(guardado);
      if (
        datos &&
        typeof datos.imagen === "string" &&
        typeof datos.opacidad === "number"
      ) {
        return { ...FONDO_DEFECTO, ...datos };
      }
    }
  } catch {
    // localStorage no disponible
  }
  return FONDO_DEFECTO;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [tema, setTema] = useState<Tema>(leerTemaInicial);
  const [fondo, setFondo] = useState<FondoPersonalizacion>(leerFondoInicial);

  // Aplica el tema actualizando el atributo data-tema
  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema.id);
    try {
      localStorage.setItem(CLAVE_LOCAL, tema.id);
    } catch {
      // sin persistencia
    }
  }, [tema]);

  // Aplica el fondo del sidebar vía variables CSS en <html>
  useEffect(() => {
    const raiz = document.documentElement;
    const valorImagen =
      fondo.imagen === ""
        ? "none"
        : fondo.imagen.startsWith("data:")
          ? `url("${fondo.imagen}")`
          : fondo.imagen;

    raiz.style.setProperty("--sidebar-imagen", valorImagen);
    raiz.style.setProperty("--sidebar-opacidad", String(fondo.opacidad));
    raiz.style.setProperty("--sidebar-escala", String(fondo.escala));
    raiz.style.setProperty("--sidebar-posicion", fondo.posicion);
    try {
      localStorage.setItem(CLAVE_FONDO, JSON.stringify(fondo));
    } catch {
      // sin persistencia (p. ej. imagen muy grande)
    }
  }, [fondo]);

  const cambiarTema = useCallback((id: string) => {
    const encontrado = TEMAS.find((t) => t.id === id);
    if (encontrado) setTema(encontrado);
  }, []);

  const resetearFondo = useCallback(() => {
    setFondo(FONDO_DEFECTO);
  }, []);

  const exportarConfiguracion = useCallback(() => {
    const config = { version: 1, tema: tema.id, fondo };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "organisador-tema.json";
    enlace.click();
    URL.revokeObjectURL(url);
  }, [tema.id, fondo]);

  const importarConfiguracion = useCallback(
    (contenido: string): boolean => {
      try {
        const datos = JSON.parse(contenido);
        const encontrado = TEMAS.find((t) => t.id === datos?.tema);
        if (!encontrado) return false;
        setTema(encontrado);
        if (
          datos?.fondo &&
          typeof datos.fondo.imagen === "string" &&
          typeof datos.fondo.opacidad === "number"
        ) {
          setFondo({ ...FONDO_DEFECTO, ...datos.fondo });
        }
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const valor = useMemo(
    () => ({
      tema,
      cambiarTema,
      fondo,
      setFondo,
      resetearFondo,
      exportarConfiguracion,
      importarConfiguracion,
    }),
    [tema, cambiarTema, fondo, setFondo, resetearFondo, exportarConfiguracion, importarConfiguracion],
  );

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
