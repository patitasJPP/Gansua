import { Fragment, useEffect, useState, useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarCheck2,
  Check,
  CloudUpload,
  Loader2,
  Pill,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useHabitos } from "../hook/useHabitos";
import { useDatosSemana } from "../hook/useDatosSemana";
import { useHabitosLocalStorage } from "../hook/useHabitosLocalStorage";
import { useSincronizacion } from "../hook/useSincronizacion";
import { habitosService } from "../../../Services/habitos";

const dias = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const capitalizar = (texto: string | undefined) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const HabitosPage = () => {
  const [misHabitos, refrescarHabitos] = useHabitos();
  const [datosSemana, refrescarDatosSemana] = useDatosSemana();
  const [completados, setCompletados] = useState<Record<string, boolean>>({});
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoHabito, setNuevoHabito] = useState("");
  const [guardandoHabito, setGuardandoHabito] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  const { cargar, guardar, limpiar } = useHabitosLocalStorage();
  const { calcularCambios, sincronizar, sincronizarBeacon } = useSincronizacion();

  const semanaActual = datosSemana[0]?.semana ?? "semana 1";

  // ✅ EXTRAE hábitos únicos de datosSemana si misHabitos está vacío
  const habitosValidos = useMemo(() => {
    if (misHabitos.length > 0 && misHabitos[0]?.id) {
      return misHabitos; // Usa los del endpoint si vienen bien
    }

    // Si están vacíos, extrae de datosSemana
    const habitosUnicos = new Map();
    let id = 1;

    datosSemana.forEach((dato) => {
      if (dato.habitos && !habitosUnicos.has(dato.habitos)) {
        habitosUnicos.set(dato.habitos, { id: id++, habitos: dato.habitos });
      }
    });

    return Array.from(habitosUnicos.values());
  }, [misHabitos, datosSemana]);

  const idPorNombre = useMemo(
    () => Object.fromEntries(habitosValidos.map((h) => [h.habitos, h.id])),
    [habitosValidos],
  );

  // ✅ Marca los habitos que vienen de la BD para la semana actual
  const completadosBD = useMemo(() => {
    const marcados: Record<string, boolean> = {};
    datosSemana.forEach((dato) => {
      const id = idPorNombre[dato.habitos];
      if (dato.dias && id !== undefined) {
        marcados[`${dato.dias}-${id}`] = true;
      }
    });
    return marcados;
  }, [datosSemana, idPorNombre]);

  // Al cargar: si hay datos en localStorage para esta semana, esos mandan;
  // si no, se usa lo que trae la BD.
  useEffect(() => {
    if (habitosValidos.length === 0) return;

    const guardados = cargar(semanaActual);
    if (Object.keys(guardados).length > 0) {
      setCompletados(guardados);
      const { marcados, desmarcados } = calcularCambios(guardados, completadosBD);
      setCambiosPendientes(marcados.length > 0 || desmarcados.length > 0);
    } else {
      setCompletados(completadosBD);
      setCambiosPendientes(false);
    }
  }, [habitosValidos, semanaActual, completadosBD, cargar, calcularCambios]);

  // Refs para que el listener de pagehide lea el estado mas reciente
  const completadosRef = useRef(completados);
  completadosRef.current = completados;
  const cambiosPendientesRef = useRef(cambiosPendientes);
  cambiosPendientesRef.current = cambiosPendientes;
  const semanaRef = useRef(semanaActual);
  semanaRef.current = semanaActual;

  // ✅ Sincroniza los cambios pendientes con el backend
  const aplicarSincronizacion = useCallback(
    async (completadosLocal: Record<string, boolean>, bd: Record<string, boolean>, semana: string) => {
      const { marcados, desmarcados } = calcularCambios(completadosLocal, bd);
      if (marcados.length === 0 && desmarcados.length === 0) {
        setCambiosPendientes(false);
        return { success: true, message: "Sin cambios" };
      }
      const resultado = await sincronizar(semana, marcados, desmarcados);
      if (resultado.success) {
        limpiar(semana);
        setCambiosPendientes(false);
        await refrescarDatosSemana();
      }
      return resultado;
    },
    [calcularCambios, sincronizar, limpiar, refrescarDatosSemana],
  );

  // ✅ Botón manual de guardado
  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      const resultado = await aplicarSincronizacion(
        completadosRef.current,
        completadosBD,
        semanaRef.current,
      );
      console.log("Resultado sincronizacion manual:", resultado);
    } finally {
      setSincronizando(false);
    }
  };

  // ✅ Al cerrar o recargar la página: enviar con sendBeacon si hay cambios
  useEffect(() => {
    const manejarPageHide = () => {
      if (!cambiosPendientesRef.current) return;
      const { marcados, desmarcados } = calcularCambios(
        completadosRef.current,
        completadosBD,
      );
      if (marcados.length > 0 || desmarcados.length > 0) {
        sincronizarBeacon(semanaRef.current, marcados, desmarcados);
      }
    };
    window.addEventListener("pagehide", manejarPageHide);
    return () => window.removeEventListener("pagehide", manejarPageHide);
  }, [calcularCambios, completadosBD, sincronizarBeacon]);

  const toggle = (dia: string, habitoId: number) => {
    const clave = `${dia}-${habitoId}`;
    const nuevoEstado = { ...completados, [clave]: !completados[clave] };
    setCompletados(nuevoEstado);
    guardar(semanaActual, nuevoEstado);
    setCambiosPendientes(true);
  };

  const abrirModal = () => {
    setNuevoHabito("");
    setMensajeError("");
    setModalAbierto(true);
  };

  const handleAgregarHabito = async () => {
    const nombre = nuevoHabito.trim();
    if (!nombre) {
      setMensajeError("Escribe el nombre del hábito");
      return;
    }
    setGuardandoHabito(true);
    try {
      await habitosService.crear(nombre);
      await refrescarHabitos();
      await refrescarDatosSemana();
      setNuevoHabito("");
      setModalAbierto(false);
      setMensajeError("");
    } catch (error) {
      console.error("Error al crear el hábito:", error);
      setMensajeError("No se pudo crear el hábito");
    } finally {
      setGuardandoHabito(false);
    }
  };

  const handleEliminarHabito = async (id: number) => {
    setEliminandoId(id);
    try {
      await habitosService.eliminar(id);
      // Limpia las marcas locales del hábito eliminado para no dejar claves fantasma
      const resto = Object.fromEntries(
        Object.entries(completadosRef.current).filter(
          ([clave]) => !clave.endsWith(`-${id}`),
        ),
      );
      guardar(semanaRef.current, resto);
      await refrescarHabitos();
      await refrescarDatosSemana();
    } catch (error) {
      console.error("Error al eliminar el hábito:", error);
      window.alert("No se pudo eliminar el hábito");
    } finally {
      setEliminandoId(null);
    }
  };

  if (!habitosValidos || habitosValidos.length === 0) {
    return (
      <div className="min-h-screen bg-brand-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-brand-600 mt-3 text-lg">Cargando hábitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100/60 p-8">
      {/* CABECERA */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-900">Mis Hábitos</h1>
              <p className="text-brand-700 mt-0.5">
                Marca los hábitos que cumpliste cada día
              </p>
            </div>
          </div>
          <AnimatePresence>
            {cambiosPendientes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full font-medium">
                  <TriangleAlert className="w-4 h-4" />
                  Cambios sin guardar - se sincronizarán al recargar o cerrar
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {habitosValidos.length > 0 && (
            <div className="inline-flex items-center gap-2 text-sm text-brand-700 bg-brand-100 rounded-full px-4 py-2 font-medium">
              <Pill className="w-4 h-4" />
              {habitosValidos.length} hábitos
            </div>
          )}
          <button
            type="button"
            onClick={abrirModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold shadow-lg shadow-brand-600/30 hover:from-brand-700 hover:to-brand-600 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Agregar hábito
          </button>
          <button
            type="button"
            onClick={handleSincronizar}
            disabled={!cambiosPendientes || sincronizando}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {sincronizando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : cambiosPendientes ? (
              <CloudUpload className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {sincronizando
              ? "Guardando..."
              : cambiosPendientes
                ? "Guardar cambios"
                : "Cambios guardados"}
          </button>
        </div>
      </div>

      {/* TABLA DE LA SEMANA */}
      <div className="tarjeta overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-[190px_repeat(7,1fr)]">
            {/* Esquina superior izquierda */}
            <div className="p-4 bg-brand-700 text-white font-semibold sticky left-0 z-10">
              Hábito
            </div>

            {/* Días en la parte superior */}
            {dias.map((dia) => (
              <div
                key={`dia-${dia}`}
                className="p-4 bg-brand-700 text-white font-semibold text-center"
              >
                {capitalizar(dia)}
              </div>
            ))}

            {/* Hábitos a la izquierda con sus casillas */}
            {habitosValidos.map((habito) => (
              <Fragment key={`habito-${habito.id}`}>
                <div className="p-4 border-t border-brand-100 text-brand-800 font-medium flex items-center justify-between gap-2 bg-white sticky left-0 z-10">
                  <span>{capitalizar(habito.habitos)}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmarEliminar({ id: habito.id, nombre: habito.habitos })
                    }
                    disabled={eliminandoId === habito.id}
                    className="w-7 h-7 shrink-0 flex items-center justify-center rounded-md text-brand-300 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50 cursor-pointer"
                    title={`Eliminar ${habito.habitos}`}
                  >
                    {eliminandoId === habito.id ? (
                      <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {dias.map((dia) => {
                  const completado = completados[`${dia}-${habito.id}`];
                  return (
                    <button
                      type="button"
                      key={`${habito.id}-${dia}`}
                      onClick={() => toggle(dia, habito.id)}
                      className="p-4 border-t border-brand-100 flex items-center justify-center hover:bg-brand-50 transition cursor-pointer"
                      title={completado ? "Completado" : "Pendiente"}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {completado ? (
                          <motion.span
                            key="completado"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 30 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center shadow-sm"
                          >
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="pendiente"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            className="w-6 h-6 rounded-md border-2 border-brand-300"
                          />
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para agregar un hábito */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div
            key="modal-agregar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 backdrop-blur-sm p-4"
            onClick={() => setModalAbierto(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
                    <Plus className="w-6 h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-900">
                      Nuevo hábito
                    </h2>
                    <p className="text-sm text-brand-600">
                      Agrega un hábito a tu rutina
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-400 hover:bg-brand-50 hover:text-brand-700 transition cursor-pointer"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-sm font-medium text-brand-800 mb-1.5">
                Nombre del hábito
              </label>
              <input
                type="text"
                autoFocus
                value={nuevoHabito}
                onChange={(e) => {
                  setNuevoHabito(e.target.value);
                  if (mensajeError) setMensajeError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAgregarHabito();
                }}
                placeholder="Ej: leer, meditar, correr..."
                className="w-full px-4 py-2.5 rounded-lg border border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-brand-900 placeholder:text-brand-300 transition"
              />

              {mensajeError && (
                <p className="mt-2 text-sm text-red-600">{mensajeError}</p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-lg text-brand-700 bg-brand-50 hover:bg-brand-100 font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAgregarHabito}
                  disabled={guardandoHabito}
                  className="px-5 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 shadow-lg shadow-brand-600/30 disabled:opacity-50 transition cursor-pointer"
                >
                  {guardandoHabito ? "Guardando..." : "Guardar hábito"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmación para eliminar un hábito */}
      <AnimatePresence>
        {confirmarEliminar && (
          <motion.div
            key="modal-eliminar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 backdrop-blur-sm p-4"
            onClick={() => setConfirmarEliminar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-900">
                    Eliminar hábito
                  </h2>
                  <p className="text-sm text-brand-600">
                    Se borrará también su historial de la semana
                  </p>
                </div>
              </div>

              <p className="text-brand-800">
                ¿Eliminar el hábito{" "}
                <span className="font-semibold">
                  "{capitalizar(confirmarEliminar.nombre)}"
                </span>
                ?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmarEliminar(null)}
                  className="px-4 py-2 rounded-lg text-brand-700 bg-brand-50 hover:bg-brand-100 font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const { id } = confirmarEliminar;
                    setConfirmarEliminar(null);
                    handleEliminarHabito(id);
                  }}
                  disabled={eliminandoId === confirmarEliminar.id}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-600/30 disabled:opacity-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitosPage;
