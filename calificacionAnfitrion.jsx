function CalificacionesDeAnfitriones({ token }) {
    const [comentarios, setComentarios] = React.useState([]);
    React.useEffect(() => {
      api("/prestadores/mi-rating", { token })
        .then(d => setComentarios(d.comentarios || []));
    }, [token]);
    return (
      <div>
        <h3>Resenas de tus arrendadores (anfitriones)</h3>
        {comentarios.map((c, i) => (
          <div key={i}>
            <strong>{c.arrendador_nombre}</strong>
            <Stars value={c.puntuacion} />
            {c.comentario && <p>"{c.comentario}"</p>}
            <small>{new Date(c.creado_en).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    );
  }
  