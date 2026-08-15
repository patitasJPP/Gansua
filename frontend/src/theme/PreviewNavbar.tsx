import { CalendarCheck2, Palette, User } from "lucide-react";

/**
 * Maqueta en miniatura del menú lateral que refleja en vivo el tema
 * activo y el fondo personalizado (imagen, opacidad, escala y posición),
 * reutilizando las mismas variables CSS aplicadas al <html>.
 */
export const PreviewNavbar = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-brand-200 shadow-xl h-full min-h-[400px]">
      {/* Fondo personalizable */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "var(--sidebar-imagen)",
          backgroundSize: "cover",
          backgroundPosition: "var(--sidebar-posicion)",
          transform: "scale(var(--sidebar-escala))",
          opacity: "var(--sidebar-opacidad)",
        }}
      />
      {/* Capa de legibilidad (más clara que en el menú real para que se
          aprecien los colores del fondo seleccionado) */}
      <div aria-hidden className="absolute inset-0 bg-brand-50/55 backdrop-blur-sm" />

      <div className="relative z-10 h-full flex flex-col p-4">
        {/* Cuenta */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-brand-200/80 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow shadow-brand-600/30 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-brand-900 truncate">
              Organisador
            </p>
            <p className="text-[10px] text-brand-700 mt-0.5">Cuenta</p>
          </div>
        </div>

        {/* Herramientas */}
        <div className="py-4 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-brand-800 font-semibold">
            Herramientas
          </p>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-br from-brand-700 to-brand-600 text-white shadow shadow-brand-700/30">
            <CalendarCheck2 className="w-4 h-4" />
            <span className="text-xs font-medium">Hábitos</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg text-brand-700">
            <CalendarCheck2 className="w-4 h-4" />
            <span className="text-xs font-medium">Estadísticas</span>
          </div>
        </div>

        {/* Personalización al pie */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-100 text-brand-800">
            <Palette className="w-4 h-4" />
            <span className="text-xs font-medium">Personalización</span>
          </div>
        </div>
      </div>
    </div>
  );
};
