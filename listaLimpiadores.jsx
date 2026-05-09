function ListaLimpiadores({ token }) {
    const [prestadores, setPrestadores] = React.useState([]);
    React.useEffect(() => {
      api("/prestadores", { token }).then(d => setPrestadores(d.prestadores || []));
    }, [token]);
    return prestadores.map(p => (
      <div key={p.id}>
        <h3>{p.nombre} {p.apellido}</h3>
        <p>Disponibilidades libres:</p>
        {p.disponibilidades.map(d => (
          <span key={d.id}>{d.fecha} - {d.franja_horaria}</span>
        ))}
      </div>
    ));
  }
  