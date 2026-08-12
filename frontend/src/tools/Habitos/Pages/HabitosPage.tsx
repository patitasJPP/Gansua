import { Fragment, useEffect, useState, useMemo } from "react";
import { useHabitos } from "../hook/usehabitos";
import { useDatosSemana } from "../hook/useDatosSemana";

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

  useEffect(() => {
    const marcados: Record<string, boolean> = {};
    datosSemana.forEach((dato) => {
      const id = idPorNombre[dato.habitos];
      if (dato.dias && id !== undefined) {
        marcados[`${dato.dias}-${id}`] = true;
      }
    });
    setCompletados((prev) => ({ ...prev, ...marcados }));
  }, [datosSemana, habitosValidos]);

  const toggle = (dia: string, habitoId: number) => {
    const clave = `${dia}-${habitoId}`;
    setCompletados((prev) => ({ ...prev, [clave]: !prev[clave] }));
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
        </div>
        {habitosValidos.length > 0 && (
          <div className="text-sm text-emerald-700 bg-emerald-100 rounded-full px-4 py-2 font-medium">
            {habitosValidos.length} hábitos
          </div>
        )}
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
