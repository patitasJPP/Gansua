import { NavLink } from "react-router-dom";
import { BarChart3, CalendarCheck2, NotebookPen, Settings2 } from "lucide-react";

const links = [
  { to: "/habitos", etiqueta: "Hábitos", icono: CalendarCheck2 },
  { to: "/habitos/estadisticas", etiqueta: "Estadísticas", icono: BarChart3 },
  { to: "/habitos/notas", etiqueta: "Notas", icono: NotebookPen },
  { to: "/habitos/general", etiqueta: "General", icono: Settings2 },
];

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-20 h-[100px] bg-brand-200/70 backdrop-blur text-brand-900 flex items-center gap-3 px-8 shadow-sm border-b border-brand-300/60">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/habitos"}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-7 py-3 rounded-2xl font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-white/90 shadow-sm text-brand-900"
                : "text-brand-700 hover:bg-brand-300/40 hover:text-brand-900"
            }`
          }
        >
          <link.icono className="w-6 h-6" />
          <span className="text-lg">{link.etiqueta}</span>
        </NavLink>
      ))}
    </nav>
  );
};
