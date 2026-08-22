import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck2, Eye, Menu, Palette, User, X } from "lucide-react";
import { PersonalizacionPanel } from "../theme/PersonalizacionPanel";
import { PreviewNavbar } from "../theme/PreviewNavbar";

const herramientas = [{ to: "/habitos", etiqueta: "Hábitos", icono: CalendarCheck2 }];

export const Navbar = () => {
  const [abierta, setAbierta] = useState(false);
  const [personalizacionAbierta, setPersonalizacionAbierta] = useState(false);

  return (
    <>
      {/* Botón flotante para abrir el menú en móvil */}
      <button
        type="button"
        onClick={() => setAbierta(true)}
        aria-label="Abrir menú"
        className="fixed bottom-4 right-4 z-50 lg:hidden w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-xl shadow-brand-600/40 flex items-center justify-center cursor-pointer transition hover:bg-brand-700"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Telón de fondo en móvil */}
      <AnimatePresence>
        {abierta && (
          <motion.div
            key="telon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAbierta(false)}
            className="fixed inset-0 z-40 bg-brand-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Barra lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] flex flex-col overflow-hidden shadow-lg border-r border-brand-200 transition-transform duration-300 lg:static lg:translate-x-0 ${
          abierta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Fondo personalizable (imagen / gradiente) */}
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
        {/* Capa de legibilidad: mantiene el texto siempre visible */}
        <div aria-hidden className="absolute inset-0 bg-brand-50/85 backdrop-blur-xl" />

        <div className="relative z-10 flex h-full flex-col">
          {/* SECCIÓN CUENTA / PERSONA */}
          <div className="p-4 sm:p-6 border-b border-brand-200/80 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-tight text-brand-900 truncate">
                Organisador
              </p>
              <p className="text-xs text-brand-700 mt-0.5">Cuenta</p>
            </div>
            <button
              type="button"
              onClick={() => setAbierta(false)}
              aria-label="Cerrar menú"
              className="ml-auto lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-brand-400 hover:bg-brand-100 hover:text-brand-700 transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido desplazable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* SECCIÓN HERRAMIENTAS */}
            <section>
              <h3 className="text-xs uppercase tracking-wider text-brand-800 mb-3 font-semibold">
                Herramientas
              </h3>
              <div className="space-y-1.5">
                {herramientas.map((herramienta) => (
                  <NavLink
                    key={herramienta.to}
                    to={herramienta.to}
                    onClick={() => setAbierta(false)}
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
                        <span className="relative z-10">
                          {herramienta.etiqueta}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </section>
          </div>

          {/* SECCIÓN CONFIGURACIÓN / EXTRAS */}
          <div className="shrink-0 p-4 sm:p-6 border-t border-brand-200/80 space-y-3">
            <button
              type="button"
              onClick={() => setPersonalizacionAbierta(true)}
              className="w-full inline-flex items-center gap-3 p-3 rounded-xl bg-brand-100 hover:bg-brand-200 text-brand-800 font-medium transition cursor-pointer"
            >
              <Palette className="w-5 h-5" />
              Personalización
            </button>
          </div>
        </div>
      </aside>

      {/* Modal de personalización */}
      <AnimatePresence>
        {personalizacionAbierta && (
          <motion.div
            key="modal-personalizacion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-950/60 backdrop-blur-sm p-4"
            onClick={() => setPersonalizacionAbierta(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-900">
                      Personalización
                    </h2>
                    <p className="text-sm text-brand-600">
                      Temas de color y fondo del menú
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPersonalizacionAbierta(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-400 hover:bg-brand-50 hover:text-brand-700 transition cursor-pointer shrink-0"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Configuración */}
                <div className="min-w-0">
                  <PersonalizacionPanel />
                </div>

                {/* Vista previa en vivo */}
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-2 text-brand-800 font-semibold mb-3">
                    <Eye className="w-4 h-4" />
                    <span>Vista previa</span>
                  </div>
                  <p className="text-xs text-brand-600 mb-3">
                    Así se verá el menú lateral con el tema y el fondo
                    seleccionados.
                  </p>
                  <div className="flex-1">
                    <PreviewNavbar />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
