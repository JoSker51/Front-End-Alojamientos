function PanelNotificaciones({ token, onChange }) {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    api("/notificaciones", { token }).then(d => setItems(d.notificaciones || []));
  }, [token]);
  return items.map(n => (
    <div key={n.id} className={n.leida ? "" : "bg-amber-50"}>
      {n.mensaje}
      <small>{new Date(n.creado_en).toLocaleString()}</small>
    </div>
  ));
}
