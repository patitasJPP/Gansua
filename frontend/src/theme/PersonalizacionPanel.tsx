import { useCallback, useRef, useState } from "react";
import {
  Check,
  Download,
  ImageIcon,
  ImagePlus,
  Palette,
  RotateCcw,
  Upload,
} from "lucide-react";
import { TEMAS, useTheme } from "./ThemeContext";

/**
 * Fondos predefinidos correlacionados con el color de la app:
 * usan variables CSS del tema activo (--brand-*) y --secundario,
 * así se generan a partir de la paleta actual y se actualizan
 * automáticamente al cambiar de tema.
 */
const FONDOS_PREDEFINIDOS: { id: string; nombre: string; valor: string }[] = [
  { id: "default", nombre: "Defecto", valor: "" },
  {
    id: "vibrante",
    nombre: "Vibrante",
    valor: "linear-gradient(135deg, var(--brand-700), var(--brand-500))",
  },
  {
    id: "profundo",
    nombre: "Profundo",
    valor: "linear-gradient(135deg, var(--brand-950), var(--brand-800))",
  },
  {
    id: "oscuro",
    nombre: "Oscuro",
    valor: "linear-gradient(135deg, var(--brand-900), var(--brand-700))",
  },
  {
    id: "medio",
    nombre: "Medio",
    valor: "linear-gradient(135deg, var(--brand-800), var(--brand-600))",
  },
  {
    id: "claro",
    nombre: "Claro",
    valor: "linear-gradient(135deg, var(--brand-200), var(--brand-100))",
  },
  {
    id: "acento",
    nombre: "Acento",
    valor: "linear-gradient(135deg, var(--brand-950), var(--secundario))",
  },
  {
    id: "doble",
    nombre: "Doble tono",
    valor: "linear-gradient(135deg, var(--brand-800), var(--secundario))",
  },
  {
    id: "radiante",
    nombre: "Radiante",
    valor: "linear-gradient(135deg, var(--brand-600), var(--secundario))",
  },
];

const POSICIONES: { id: string; nombre: string }[] = [
  { id: "center", nombre: "Centro" },
  { id: "top", nombre: "Arriba" },
  { id: "bottom", nombre: "Abajo" },
  { id: "left", nombre: "Izquierda" },
  { id: "right", nombre: "Derecha" },
];

export const PersonalizacionPanel = () => {
  const {
    tema,
    cambiarTema,
    fondo,
    setFondo,
    resetearFondo,
    exportarConfiguracion,
    importarConfiguracion,
  } = useTheme();

  const inputImagen = useRef<HTMLInputElement>(null);
  const inputImportar = useRef<HTMLInputElement>(null);
  const [errorImportar, setErrorImportar] = useState("");

  const subirImagen = useCallback(
    (archivo: File | undefined) => {
      if (!archivo) return;
      const lector = new FileReader();
      lector.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Reduce la imagen para que quepa en localStorage
          const maxLado = 1600;
          const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * escala));
          canvas.height = Math.max(1, Math.round(img.height * escala));
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setFondo({ ...fondo, imagen: canvas.toDataURL("image/jpeg", 0.82) });
        };
        img.src = String(lector.result);
      };
      lector.readAsDataURL(archivo);
    },
    [fondo, setFondo],
  );

  const manejarImportar = (archivo: File | undefined) => {
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      const ok = importarConfiguracion(String(lector.result));
      setErrorImportar(ok ? "" : "El archivo de configuración no es válido");
    };
    lector.readAsText(archivo);
  };

  return (
    <div className="space-y-6">
      {/* ============ COLOR DE LA APP ============ */}
      <section>
        <div className="flex items-center gap-2 text-brand-800 font-semibold mb-3">
          <Palette className="w-4 h-4" />
          <span>Color de la app</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {TEMAS.map((t) => {
            const activo = t.id === tema.id;
            return (
              <button
                key={t.id}
                type="button"
                title={t.nombre}
                aria-label={`Tema ${t.nombre}`}
                onClick={() => cambiarTema(t.id)}
                className={`relative h-9 rounded-lg cursor-pointer transition-transform hover:scale-105 ${
                  activo
                    ? "ring-2 ring-offset-2 ring-offset-brand-50 ring-brand-900"
                    : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${t.muestra}, ${t.secundario})`,
                }}
              >
                {activo && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check
                      className="w-4 h-4 text-white drop-shadow"
                      strokeWidth={3}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-brand-600 font-medium">
          Tema activo:{" "}
          <span className="text-brand-800 font-semibold">{tema.nombre}</span>
        </p>
      </section>

      {/* ============ FONDO DEL MENÚ ============ */}
      <section className="border-t border-brand-200/70 pt-5">
        <div className="flex items-center gap-2 text-brand-800 font-semibold mb-3">
          <ImageIcon className="w-4 h-4" />
          <span>Fondo del menú</span>
        </div>

        {/* Galería de fondos predefinidos */}
        <p className="text-xs text-brand-600 mb-2">Galería</p>
        <div className="grid grid-cols-3 gap-2">
          {FONDOS_PREDEFINIDOS.map((f) => {
            const activo = fondo.imagen === f.valor;
            return (
              <button
                key={f.id}
                type="button"
                title={f.nombre}
                onClick={() => setFondo({ ...fondo, imagen: f.valor })}
                className={`relative h-12 rounded-lg cursor-pointer transition-transform hover:scale-105 border ${
                  activo
                    ? "ring-2 ring-offset-1 ring-offset-brand-50 ring-brand-900 border-transparent"
                    : "border-brand-200"
                }`}
                style={{
                  backgroundImage: f.valor || "var(--brand-100)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {f.nombre === "Defecto" && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-brand-700">
                    Defecto
                  </span>
                )}
                {activo && f.nombre !== "Defecto" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white drop-shadow" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subir imagen personalizada */}
        <input
          ref={inputImagen}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            subirImagen(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputImagen.current?.click()}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand-100 hover:bg-brand-200 text-brand-800 text-sm font-medium transition cursor-pointer"
        >
          <ImagePlus className="w-4 h-4" />
          Subir mi imagen
        </button>

        {/* Ajustes */}
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="flex items-center justify-between text-xs text-brand-600 mb-1">
              <span>Opacidad</span>
              <span className="font-semibold text-brand-800">
                {Math.round(fondo.opacidad * 100)}%
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(fondo.opacidad * 100)}
              onChange={(e) =>
                setFondo({ ...fondo, opacidad: Number(e.target.value) / 100 })
              }
              className="w-full"
            />
          </label>

          <label className="block">
            <span className="flex items-center justify-between text-xs text-brand-600 mb-1">
              <span>Escala</span>
              <span className="font-semibold text-brand-800">
                {fondo.escala.toFixed(2)}x
              </span>
            </span>
            <input
              type="range"
              min={100}
              max={250}
              step={5}
              value={Math.round(fondo.escala * 100)}
              onChange={(e) =>
                setFondo({ ...fondo, escala: Number(e.target.value) / 100 })
              }
              className="w-full"
            />
          </label>

          <label className="block">
            <span className="text-xs text-brand-600 mb-1 block">Posición</span>
            <select
              value={fondo.posicion}
              onChange={(e) => setFondo({ ...fondo, posicion: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-brand-300 bg-white text-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition cursor-pointer"
            >
              {POSICIONES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={resetearFondo}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-brand-300 hover:bg-brand-100 text-brand-800 text-sm font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer fondo
          </button>
        </div>
      </section>

      {/* ============ RESPALDO / CONFIGURACIÓN ============ */}
      <section className="border-t border-brand-200/70 pt-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportarConfiguracion}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 shadow shadow-brand-600/30 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <input
            ref={inputImportar}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              manejarImportar(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputImportar.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-brand-300 hover:bg-brand-100 text-brand-800 text-sm font-medium transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Importar
          </button>
        </div>
        {errorImportar && (
          <p className="mt-2 text-xs text-red-600">{errorImportar}</p>
        )}
      </section>
    </div>
  );
};
