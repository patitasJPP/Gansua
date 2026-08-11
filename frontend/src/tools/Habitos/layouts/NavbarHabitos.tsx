import React from "react";

export const Navbar = () => {
  return (
    <nav className="h-14 bg-emerald-200 text-emerald-900 flex items-center px-6 gap-8 shadow-sm">
      <span className="text-emerald-800 text-sm uppercase tracking-wider font-bold border-b-2 border-emerald-700 pb-1">
        Hábitos
      </span>
      <span className="text-emerald-700 text-sm uppercase tracking-wider font-medium hover:text-emerald-800 cursor-pointer transition">
        Estadísticas
      </span>
      <span className="text-emerald-700 text-sm uppercase tracking-wider font-medium hover:text-emerald-800 cursor-pointer transition">
        Notas
      </span>
      <span className="text-emerald-700 text-sm uppercase tracking-wider font-medium hover:text-emerald-800 cursor-pointer transition">
        General
      </span>
    </nav>
  );
};
