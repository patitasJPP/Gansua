import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { CalendarCheck2, Palette, User } from "lucide-react";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";

const herramientas = [{ to: "/habitos", etiqueta: "Hábitos", icono: CalendarCheck2 }];

export const Navbar = () => {
  return (
    <aside className="w-[300px] h-screen bg-brand-100/70 backdrop-blur text-brand-900 flex flex-col shadow-lg border-r border-brand-200">
      {/* SECCIÓN CUENTA / PERSONA */}
      <div className="p-6 border-b border-brand-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
          <User className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold leading-tight">Organisador</p>
          <p className="text-xs text-brand-700 mt-0.5">Cuenta</p>
        </div>
      </div>

      {/* SECCIÓN HERRAMIENTAS */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-xs uppercase tracking-wider text-brand-800 mb-3 font-semibold">
          Herramientas
        </h3>
        <div className="space-y-1.5">
          {herramientas.map((herramienta) => (
            <NavLink
              key={herramienta.to}
              to={herramienta.to}
              className={({ isActive }) =>
                `relative w-full flex items-center gap-3 p-3 rounded-xl font-medium transition cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-brand-700 hover:bg-brand-200/60 hover:text-brand-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-activo"
                      className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-600 shadow-lg shadow-brand-700/30 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <herramienta.icono className="relative z-10 w-5 h-5" />
                  <span className="relative z-10">{herramienta.etiqueta}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* SECCIÓN CONFIGURACIONES Y EXTRAS */}
      <div className="p-6 border-t border-brand-200 space-y-3">
        <div className="flex items-center gap-2 text-brand-800 font-semibold">
          <Palette className="w-4 h-4" />
          <span>Color de la app</span>
        </div>
        <ThemeSwitcher />
      </div>
    </aside>
  );
};
