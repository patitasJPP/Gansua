import { NavLink } from "react-router-dom";
import { BarChart3, CalendarCheck2 } from "lucide-react";

const links = [
  { to: "/habitos", etiqueta: "Hábitos", icono: CalendarCheck2 },
  { to: "/habitos/estadisticas", etiqueta: "Estadísticas", icono: BarChart3 },
];

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-20 h-auto sm:h-[100px] bg-brand-200/70 backdrop-blur text-brand-900 flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-0 shadow-sm border-b border-brand-300/60">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/habitos"}
          className={({ isActive }) =>
            `flex items-center gap-2 sm:gap-2.5 px-4 sm:px-7 py-2 sm:py-3 rounded-2xl font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-white/90 shadow-sm text-brand-900"
                : "text-brand-700 hover:bg-brand-300/40 hover:text-brand-900"
            }`
          }
        >
          <link.icono className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-lg">{link.etiqueta}</span>
        </NavLink>
      ))}
    </nav>
  );
};
