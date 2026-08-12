import { Fragment, useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useHabitos } from "../hook/useHabitos";
import { useDatosSemana } from "../hook/useDatosSemana";
import { useHabitosLocalStorage } from "../hook/useHabitosLocalStorage";
import { useSincronizacion } from "../hook/useSincronizacion";

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
  const [misHabitos] = useHabitos();
  const [datosSemana] = useDatosSemana();
  const [completados, setCompletados] = useState<Record<string, boolean>>({});
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

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

  const idPorNombre = Object.fromEntries(
    habitosValidos.map((h) => [h.habitos, h.id]),
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
      }
      return resultado;
    },
    [calcularCambios, sincronizar, limpiar],
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

  if (!habitosValidos || habitosValidos.length === 0) {
    return (
      <div className="min-h-screen bg-emerald-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-600 text-lg">Cargando hábitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Mis Hábitos</h1>
          <p className="text-emerald-600 mt-1">
            Marca los hábitos que cumpliste cada día
          </p>
          {cambiosPendientes && (
            <span className="text-sm text-red-600 mt-2 inline-block">
              ⚠️ Cambios no guardados - se sincronizarán al recargar o cerrar
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {habitosValidos.length > 0 && (
            <div className="text-sm text-emerald-700 bg-emerald-100 rounded-full px-4 py-2 font-medium">
              {habitosValidos.length} hábitos
            </div>
          )}
          <button
            onClick={handleSincronizar}
            disabled={!cambiosPendientes || sincronizando}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {sincronizando
              ? "Guardando..."
              : cambiosPendientes
                ? "Guardar cambios"
                : "Cambios guardados"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden shadow-lg">
        <div className="grid grid-cols-[170px_repeat(7,1fr)]">
          {/* Esquina superior izquierda */}
          <div className="p-4 bg-emerald-700 text-white font-semibold">
            Hábito
          </div>

          {/* Días en la parte superior */}
          {dias.map((dia) => (
            <div
              key={`dia-${dia}`}
              className="p-4 bg-emerald-700 text-white font-semibold text-center"
            >
              {capitalizar(dia)}
            </div>
          ))}

          {/* Hábitos a la izquierda con sus casillas */}
          {habitosValidos.map((habito) => (
            <Fragment key={`habito-${habito.id}`}>
              <div className="p-4 border-t border-emerald-200 text-emerald-800 font-medium flex items-center">
                {capitalizar(habito.habitos)}
              </div>

              {dias.map((dia) => {
                const completado = completados[`${dia}-${habito.id}`];
                return (
                  <button
                    key={`${habito.id}-${dia}`}
                    onClick={() => toggle(dia, habito.id)}
                    className="p-4 border-t border-emerald-200 flex items-center justify-center hover:bg-emerald-50 transition cursor-pointer"
                    title={completado ? "Completado" : "Pendiente"}
                  >
                    {completado ? (
                      <span className="w-6 h-6 rounded-md bg-emerald-700 flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm leading-none">
                          ✓
                        </span>
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-md border-2 border-emerald-300" />
                    )}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitosPage;
