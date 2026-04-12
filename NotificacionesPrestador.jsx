
import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8000/api"; // ← cambia esto por tu URL de backend

// ── Helpers de fecha ────────────────────────────────────────
function formatFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatHora(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Estilos inline (sin dependencia de CSS externo) ─────────
const s = {
  container: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    maxWidth: 560,
    margin: "0 auto",
    padding: "24px 16px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 600,
    margin: 0,
    color: "#111",
  },
  badge: {
    background: "#e53e3e",
    color: "#fff",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    padding: "2px 9px",
    marginLeft: 8,
  },
  card: (leida) => ({
    background: leida ? "#fafafa" : "#fff",
    border: `1px solid ${leida ? "#e8e8e8" : "#d0e8ff"}`,
    borderLeft: `4px solid ${leida ? "#d0d0d0" : "#3b82f6"}`,
    borderRadius: 10,
    padding: "16px 18px",
    marginBottom: 12,
    transition: "box-shadow 0.15s",
    boxShadow: leida ? "none" : "0 2px 8px rgba(59,130,246,0.08)",
  }),
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  mensaje: (leida) => ({
    fontSize: 15,
    fontWeight: leida ? 400 : 600,
    color: leida ? "#555" : "#1a1a1a",
    margin: 0,
    lineHeight: 1.45,
  }),
  hora: {
    fontSize: 12,
    color: "#999",
    whiteSpace: "nowrap",
    marginLeft: 12,
  },
  detalle: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    margin: "10px 0",
    padding: "10px 12px",
    background: "#f5f8ff",
    borderRadius: 7,
    fontSize: 13,
    color: "#444",
  },
  detalleItem: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  detalleLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  detalleValor: {
    fontSize: 14,
    color: "#222",
    fontWeight: 500,
  },
  acciones: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },
  btnAceptar: {
    flex: 1,
    padding: "9px 0",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  btnRechazar: {
    flex: 1,
    padding: "9px 0",
    background: "#fff",
    color: "#e53e3e",
    border: "1.5px solid #e53e3e",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  estadoBadge: (estado) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    background:
      estado === "aceptada"
        ? "#dcfce7"
        : estado === "rechazada"
        ? "#fee2e2"
        : "#fef9c3",
    color:
      estado === "aceptada"
        ? "#15803d"
        : estado === "rechazada"
        ? "#b91c1c"
        : "#854d0e",
  }),
  vacio: {
    textAlign: "center",
    padding: "48px 0",
    color: "#aaa",
    fontSize: 15,
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  spinner: {
    textAlign: "center",
    padding: "40px 0",
    color: "#aaa",
    fontSize: 15,
  },
};

// ── Componente principal ─────────────────────────────────────
export default function NotificacionesPrestador({ userId }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState({}); // { [contratacion_id]: true }

  // Carga las notificaciones del prestador
  const cargarNotificaciones = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await fetch(`${API_BASE}/notificaciones`, {
        headers: { "X-User-Id": userId },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setNotificaciones(data.notificaciones || []);
    } catch (e) {
      setError("No se pudieron cargar las notificaciones. Verifica que el backend esté corriendo.");
    } finally {
      setCargando(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) cargarNotificaciones();
  }, [userId, cargarNotificaciones]);

  // Polling cada 30 segundos para simular notificaciones en tiempo real
  useEffect(() => {
    if (!userId) return;
    const intervalo = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(intervalo);
  }, [userId, cargarNotificaciones]);

  // Acepta o rechaza una contratación
  const responder = async (contratacionId, decision) => {
    setProcesando((prev) => ({ ...prev, [contratacionId]: true }));
    try {
      const res = await fetch(
        `${API_BASE}/contrataciones/${contratacionId}/responder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
          body: JSON.stringify({ decision }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error al responder");
      }
      // Actualizar estado local sin recargar todo
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.contratacion_id === contratacionId
            ? { ...n, estado_contratacion: decision, leida: true }
            : n
        )
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setProcesando((prev) => ({ ...prev, [contratacionId]: false }));
    }
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div style={s.container}>
      {/* Encabezado */}
      <div style={s.header}>
        <h2 style={s.titulo}>
          Solicitudes
          {noLeidas > 0 && <span style={s.badge}>{noLeidas}</span>}
        </h2>
        <button
          onClick={cargarNotificaciones}
          style={{
            background: "none",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: 13,
            color: "#555",
          }}
        >
          ↻ Actualizar
        </button>
      </div>

      {/* Error */}
      {error && <div style={s.error}>{error}</div>}

      {/* Cargando */}
      {cargando && <div style={s.spinner}>Cargando notificaciones…</div>}

      {/* Lista vacía */}
      {!cargando && notificaciones.length === 0 && (
        <div style={s.vacio}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
          No tienes solicitudes por el momento.
        </div>
      )}

      {/* Tarjetas de notificación */}
      {notificaciones.map((n) => (
        <div key={n.notificacion_id} style={s.card(n.leida)}>
          <div style={s.cardHeader}>
            <p style={s.mensaje(n.leida)}>{n.mensaje}</p>
            <span style={s.hora}>{formatHora(n.creado_en)}</span>
          </div>

          {/* Detalle del servicio */}
          <div style={s.detalle}>
            <div style={s.detalleItem}>
              <span style={s.detalleLabel}>Arrendador</span>
              <span style={s.detalleValor}>{n.nombre_arrendador}</span>
            </div>
            <div style={s.detalleItem}>
              <span style={s.detalleLabel}>Fecha</span>
              <span style={s.detalleValor}>{formatFecha(n.fecha_servicio)}</span>
            </div>
            <div style={s.detalleItem}>
              <span style={s.detalleLabel}>Franja</span>
              <span style={s.detalleValor}>{n.franja_horaria}</span>
            </div>
          </div>

          {/* Acciones o estado */}
          {n.estado_contratacion === "pendiente" ? (
            <div style={s.acciones}>
              <button
                style={s.btnAceptar}
                disabled={procesando[n.contratacion_id]}
                onClick={() => responder(n.contratacion_id, "aceptada")}
              >
                {procesando[n.contratacion_id] ? "…" : "✓ Aceptar"}
              </button>
              <button
                style={s.btnRechazar}
                disabled={procesando[n.contratacion_id]}
                onClick={() => responder(n.contratacion_id, "rechazada")}
              >
                {procesando[n.contratacion_id] ? "…" : "✕ Rechazar"}
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <span style={s.estadoBadge(n.estado_contratacion)}>
                {n.estado_contratacion === "aceptada"
                  ? "✓ Aceptada"
                  : "✕ Rechazada"}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
