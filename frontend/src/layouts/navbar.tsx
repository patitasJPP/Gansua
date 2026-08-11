export const Navbar = () => {
  return (
    <aside className="w-[300px] h-screen bg-emerald-100 text-emerald-900 flex flex-col shadow-lg">
      {/* SECCIÓN CUENTA / PERSONA */}
      <div className="p-6 border-b border-emerald-200">
        <span className="text-emerald-700 font-medium">Cuenta</span>
      </div>

      {/* SECCIÓN HERRAMIENTAS */}
      <div className="flex-1 p-6">
        <h3 className="text-xs uppercase tracking-wider text-emerald-800 mb-4 font-semibold">
          Herramientas
        </h3>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer transition font-medium shadow">
          <span>Hábitos</span>
        </button>
      </div>

      {/* SECCIÓN CONFIGURACIONES Y EXTRAS */}
      <div className="p-6 border-t border-emerald-200">
        <span className="text-emerald-700 font-medium">Configuración</span>
      </div>
    </aside>
  );
};
