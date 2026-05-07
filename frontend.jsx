function ReportarQueja({ contId, token, onDone }) {
  const [desc, setDesc] = React.useState("");
  async function enviar() {
    await api(`/contrataciones/${contId}/irregularidad`, {
      method: "POST", token, body: { descripcion: desc },
    });
    setDesc(""); onDone && onDone();
  }
  return (
    <div>
      <textarea value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="Describe el dano o problema..."  rows={3} />
      <button onClick={enviar} disabled={!desc.trim()}>
        ⚠ Reportar dano en la propiedad
      </button>
    </div>
  );
}
