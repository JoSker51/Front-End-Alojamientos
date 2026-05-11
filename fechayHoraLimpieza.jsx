function SeleccionarFecha({ prestador, token, onSent }) {
    async function contratar(disp) {
      if (!confirm(`Solicitar para ${disp.fecha} (${disp.franja_horaria})?`)) return;
      await api("/contrataciones", {
        method: "POST", token,
        body: { prestador_id: prestador.id, disponibilidad_id: disp.id },
      });
      onSent && onSent();
    }
    return (
      <div>
        <h4>Selecciona fecha y franja</h4>
        {prestador.disponibilidades.map(d => (
          <button key={d.id} onClick={() => contratar(d)}>
            {d.fecha} - {d.franja_horaria}
          </button>
        ))}
      </div>
    );
  }
  