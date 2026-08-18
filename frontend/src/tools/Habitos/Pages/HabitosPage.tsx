import { Fragment, useEffect, useState, useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Ban,
  CalendarCheck2,
  Check,
  CloudUpload,
  Flame,
  Loader2,
  Pill,
  Plus,
  Trophy,
  Trash2,
  TriangleAlert,
  Zap,
  X,
} from "lucide-react";
import { useHabitos } from "../hook/useHabitos";
import { useDatosSemana } from "../hook/useDatosSemana";
import { useEstadisticas } from "../hook/useEstadisticas";
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
  const [misHabitos, refrescarHabitos, cargandoHabitos] = useHabitos();
  const [datosSemana, refrescarDatosSemana] = useDatosSemana();
  const { rachas } = useEstadisticas();
  const [completados, setCompletados] = useState<Record<string, boolean>>({});
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoHabito, setNuevoHabito] = useState("");
  const [nuevoHabitoEsAbstinencia, setNuevoHabitoEsAbstinencia] = useState(false);
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
    setNuevoHabitoEsAbstinencia(false);
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
      await habitosService.crear(nombre, nuevoHabitoEsAbstinencia);
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

  if (cargandoHabitos) {
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
      {habitosValidos.length === 0 ? (
        <div className="tarjeta flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 mb-4">
            <CalendarCheck2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-brand-900">
            Agregar hábito
          </h2>
          <p className="text-brand-600 mt-1.5 max-w-md">
            Aún no tienes hábitos. Agrega tu primer hábito para empezar a
            marcar tu cumplimiento cada día.
          </p>
          <button
            type="button"
            onClick={abrirModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold shadow-lg shadow-brand-600/30 hover:from-brand-700 hover:to-brand-600 transition cursor-pointer"
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
            Agregar hábito
          </button>
        </div>
      ) : (
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
              {habitosValidos.map((habito) => {
                const esAbstinencia = habito.esAbstinencia === true;
                return (
                  <Fragment key={`habito-${habito.id}`}>
                    <div className="p-4 border-t border-brand-100 font-medium flex items-center justify-between gap-2 bg-white sticky left-0 z-10">
                      <div className="flex items-center gap-2 min-w-0">
                        {esAbstinencia && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-bold text-rose-600 bg-rose-100 rounded-full px-2 py-0.5 shrink-0">
                            <Ban className="w-3 h-3" /> Evitar
                          </span>
                        )}
                        <span
                          className={`truncate ${
                            esAbstinencia ? "text-rose-900" : "text-brand-800"
                          }`}
                        >
                          {capitalizar(habito.habitos)}
                        </span>
                      </div>
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
                          className={`p-4 border-t border-brand-100 flex items-center justify-center transition cursor-pointer ${
                            esAbstinencia
                              ? completado
                                ? "bg-rose-50"
                                : "hover:bg-rose-50/70"
                              : "hover:bg-brand-50"
                          }`}
                          title={
                            esAbstinencia
                              ? completado
                                ? "Lo evitaste"
                                : "No lo evitaste"
                              : completado
                                ? "Completado"
                                : "Pendiente"
                          }
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {completado ? (
                              <motion.span
                                key="completado"
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 30 }}
                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${
                                  esAbstinencia ? "bg-rose-500" : "bg-brand-600"
                                }`}
                              >
                                <Check className="w-4 h-4 text-white" strokeWidth={3} />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="pendiente"
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                className={`w-6 h-6 rounded-md border-2 ${
                                  esAbstinencia ? "border-rose-300" : "border-brand-300"
                                }`}
                              />
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>
          {/* Leyenda de colores */}
          <div className="px-4 py-3 border-t border-brand-100 bg-brand-50/40 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-brand-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-brand-600" /> Cumpliste / lo hiciste
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-500" /> Lo evitaste
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-600" /> Hábito que quieres evitar
            </span>
          </div>
        </div>
      )}

      {/* SECCIÓN DE RACHAS POR HÁBITO */}
      {rachas.length > 0 && (
        <div className="mt-6 tarjeta p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-900">
                Rachas por hábito
              </h2>
              <p className="text-sm text-brand-600">
                Tu mejor racha y cuánto te falta para superarla
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rachas.map((r) => {
              const porcentaje = r.rachaMaxima > 0
                ? Math.min(100, Math.round((r.rachaActual / r.rachaMaxima) * 100))
                : 0;
              const superoRacha = r.rachaActual >= r.rachaMaxima && r.rachaActual > 0;
              const diasRestantes = Math.max(0, r.rachaMaxima - r.rachaActual + 1);

              return (
                <div
                  key={r.habitoId}
                  className={`relative overflow-hidden rounded-2xl border p-5 ${
                    r.esAbstinencia
                      ? "bg-gradient-to-br from-rose-50 to-rose-100/40 border-rose-200/60"
                      : superoRacha
                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-emerald-200/60"
                        : "bg-gradient-to-br from-brand-50 to-brand-100/40 border-brand-200/60"
                  }`}
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/40" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      {superoRacha ? (
                        <Trophy className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Flame className={`w-4 h-4 ${r.esAbstinencia ? "text-rose-500" : "text-brand-500"}`} />
                      )}
                      <span className={`text-sm font-bold ${r.esAbstinencia ? "text-rose-800" : "text-brand-800"}`}>
                        {capitalizar(r.habito)}
                      </span>
                      {r.esAbstinencia && (
                        <span className="inline-flex items-center text-[10px] uppercase tracking-wide font-bold text-rose-600 bg-rose-100 rounded-full px-2 py-0.5">
                          Evitar
                        </span>
                      )}
                    </div>

                    {superoRacha ? (
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <Zap className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wide">
                            ¡Récord superado!
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-800 tabular-nums mt-1">
                          {r.rachaActual} días
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          Superaste tu racha de {r.rachaMaxima} días
                        </p>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <p className="text-xs text-brand-600">Mejor racha</p>
                        <p className={`text-2xl font-bold tabular-nums ${r.esAbstinencia ? "text-rose-800" : "text-brand-800"}`}>
                          {r.rachaMaxima} días
                        </p>
                      </div>
                    )}

                    {/* Barra de progreso */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`${r.esAbstinencia ? "text-rose-600" : superoRacha ? "text-emerald-600" : "text-brand-600"}`}>
                          Racha actual: {r.rachaActual} días
                        </span>
                        <span className={`font-semibold ${r.esAbstinencia ? "text-rose-700" : superoRacha ? "text-emerald-700" : "text-brand-700"}`}>
                          {porcentaje}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${r.esAbstinencia ? "bg-rose-100" : "bg-brand-100"}`}>
                        <div
                          className={`h-full rounded-full transition-all ${
                            superoRacha
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                              : r.esAbstinencia
                                ? "bg-gradient-to-r from-rose-500 to-rose-400"
                                : "bg-gradient-to-r from-brand-600 to-brand-500"
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>

                    <p className={`text-[11px] mt-2 ${r.esAbstinencia ? "text-rose-500" : superoRacha ? "text-emerald-500" : "text-brand-500"}`}>
                      {superoRacha
                        ? `Has superado tu récord de ${r.rachaMaxima} días. ¡Sigue así!`
                        : r.rachaActual > 0
                          ? `${diasRestantes} día${diasRestantes !== 1 ? "s" : ""} para superar tu mejor racha`
                          : "Empieza hoy tu nueva racha"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg ${
                      nuevoHabitoEsAbstinencia
                        ? "bg-gradient-to-br from-rose-600 to-rose-500 shadow-rose-600/30"
                        : "bg-gradient-to-br from-brand-600 to-brand-500 shadow-brand-600/30"
                    }`}
                  >
                    {nuevoHabitoEsAbstinencia ? (
                      <Ban className="w-6 h-6" />
                    ) : (
                      <Plus className="w-6 h-6" strokeWidth={3} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-900">
                      Nuevo hábito
                    </h2>
                    <p className="text-sm text-brand-600">
                      {nuevoHabitoEsAbstinencia
                        ? "Hábito que quieres dejar o evitar"
                        : "Agrega un hábito a tu rutina"}
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
                placeholder={
                  nuevoHabitoEsAbstinencia
                    ? "Ej: fumar, tomar, dulces..."
                    : "Ej: leer, meditar, correr..."
                }
                className="w-full px-4 py-2.5 rounded-lg border border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-brand-900 placeholder:text-brand-300 transition"
              />

              {/* Tipo de hábito */}
              <button
                type="button"
                onClick={() => setNuevoHabitoEsAbstinencia((v) => !v)}
                className={`mt-4 w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition cursor-pointer ${
                  nuevoHabitoEsAbstinencia
                    ? "border-rose-300 bg-rose-50"
                    : "border-brand-200 bg-brand-50/60 hover:border-brand-300"
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      nuevoHabitoEsAbstinencia
                        ? "bg-rose-100 text-rose-600"
                        : "bg-brand-100 text-brand-600"
                    }`}
                  >
                    {nuevoHabitoEsAbstinencia ? (
                      <Ban className="w-5 h-5" />
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        nuevoHabitoEsAbstinencia
                          ? "text-rose-700"
                          : "text-brand-800"
                      }`}
                    >
                      {nuevoHabitoEsAbstinencia
                        ? "Lo quiero evitar"
                        : "Lo quiero hacer"}
                    </p>
                    <p className="text-xs text-brand-600 mt-0.5">
                      {nuevoHabitoEsAbstinencia
                        ? "Marcarás los días que lo evitaste y verás tu racha de abstinencia"
                        : "Marcarás los días que cumpliste el hábito"}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                    nuevoHabitoEsAbstinencia ? "bg-rose-500" : "bg-brand-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      nuevoHabitoEsAbstinencia ? "translate-x-5" : ""
                    }`}
                  />
                </div>
              </button>

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
