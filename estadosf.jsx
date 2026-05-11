// Color y etiqueta por estado
const ESTADO_COLORS = {
  pendiente:    "bg-amber-100 text-amber-700",
  aceptada:     "bg-blue-100 text-blue-700",
  rechazada:    "bg-red-100 text-red-700",
  en_progreso:  "bg-purple-100 text-purple-700",
  finalizada:   "bg-emerald-100 text-emerald-700",
  calificada:   "bg-slate-200 text-slate-700",
};
const ESTADO_LABELS = {
  pendiente:"Pendiente", aceptada:"Aceptada", rechazada:"Rechazada",
  en_progreso:"En progreso", finalizada:"Finalizada", calificada:"Calificada",
};

function EstadoBadge({ estado }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${ESTADO_COLORS[estado]}`}>
      {ESTADO_LABELS[estado] || estado}
    </span>
  );
}
