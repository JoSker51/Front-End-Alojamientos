function SubirCredenciales({ token, onDone }) {
    const slots = [
      { key: "cv",                    label: "Hoja de vida (CV)" },
      { key: "certificacion_laboral", label: "Certificaciones laborales" },
    ];
    async function subir(file, tipo) {
      const fd = new FormData();
      fd.append("archivo", file);
      fd.append("tipo", tipo);
      await api("/archivos", { method: "POST", token, formData: fd });
      onDone && onDone();
    }
    return slots.map(s => (
      <div key={s.key}>
        <label>{s.label}
          <input type="file" onChange={e => subir(e.target.files[0], s.key)} />
        </label>
      </div>
    ));
  }
  