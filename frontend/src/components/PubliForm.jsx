import React, { useState, useEffect } from 'react';
import { fetchCities } from '../services/city.service';

export default function PubliForm({ initialData = {}, onSubmit, buttonText = "Guardar" }) {
const [form, setForm] = useState({
  titulo: initialData.titulo || "",
  estado: initialData.estado || "activo",
  descripcion: initialData.descripcion || "",
  direccion: initialData.direccion || "",
  city: initialData.city || null,
  cityNombre: initialData.cityNombre || "",
  etiquetas: Array.isArray(initialData.etiquetas) ? initialData.etiquetas.join(", ") : (initialData.etiquetas || ""),
  contacto_email: initialData.contacto_email || "",
  contacto_whatsapp: initialData.contacto_whatsapp || "",
  contacto_telefono: initialData.contacto_telefono || "",
  enlace_externo: initialData.enlace_externo || "",
  modalidad: initialData.modalidad || "",
  categoria: initialData.categoria || "",
});
  const [ciudadesTodas, setCiudadesTodas] = useState([]);
  const [ciudadSugerencias, setCiudadSugerencias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function cargarCiudades() {
      const todas = await fetchCities("");
      setCiudadesTodas(todas);
    }
    cargarCiudades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cityNombre") {
      setForm(prev => ({ ...prev, cityNombre: value, city: null }));
      if (value.length > 1 && ciudadesTodas.length > 0) {
        const sugeridas = ciudadesTodas.filter(c =>
          c.name && c.name.toLowerCase().includes(value.toLowerCase())
        );
        setCiudadSugerencias(sugeridas);
      } else {
        setCiudadSugerencias([]);
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCiudadSelect = (ciudadSeleccionada) => {
    setForm(prev => ({ ...prev, city: ciudadSeleccionada.id, cityNombre: ciudadSeleccionada.name }));
    setCiudadSugerencias([]);
  };

  const handleCiudadBlur = () => {
    if (form.cityNombre.length > 1 && ciudadSugerencias.length > 0) {
      const ciudad = ciudadSugerencias[0];
      if (ciudad && ciudad.name) {
        setForm(prev => ({ ...prev, city: ciudad.id, cityNombre: ciudad.name }));
      }
      setCiudadSugerencias([]);
    }
  };

const validate = () => {
  const newErrors = {};
  if (!form.titulo) newErrors.titulo = "El título es obligatorio";
  if (!form.descripcion) newErrors.descripcion = "La descripción es obligatoria";
  if (!form.city || isNaN(form.city) || form.city <= 0) newErrors.city = "La ciudad es obligatoria y debe ser un ID válido";
  if (!form.modalidad) newErrors.modalidad = "La modalidad es obligatoria";
  if (!form.categoria) newErrors.categoria = "La categoría es obligatoria";
  if (!form.contacto_email) newErrors.contacto_email = "El email es obligatorio";
  if (form.etiquetas) {
    const tagsArray = form.etiquetas.split(",").map(tag => tag.trim()).filter(tag => tag);
    if (tagsArray.length > 3) newErrors.etiquetas = "Máximo 3 etiquetas permitidas";
    if (tagsArray.some(tag => tag.length > 30)) newErrors.etiquetas = "Cada etiqueta debe tener máximo 30 caracteres";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Datos enviados:", form); // Para depuración
  if (validate()) {
    // eslint-disable-next-line no-unused-vars
    const { cityNombre, etiquetas, ...rest } = form;
    const dataToSend = {
      ...rest,
      etiquetas: etiquetas ? etiquetas.split(",").map(tag => tag.trim()).filter(tag => tag) : []
    };
    onSubmit(dataToSend);
  }
};

  const categorias = [
    "arte",
    "construcción",
    "educacion",
    "salud",
    "servicios generales",
    "tecnología"
  ];

  const modalidades = ["presencial", "online", "mixta"];
  const estados = ["activo", "inactivo", "bloqueado"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Título <span className="text-red-500">*</span></label>
        <input
          name="titulo"
          type="text"
          value={form.titulo}
          onChange={handleChange}
          maxLength={255}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo}</span>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Estado <span className="text-red-500">*</span></label>
        <select name="estado" value={form.estado} onChange={handleChange} className="w-full border rounded px-3 py-2">
          {estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Descripción <span className="text-red-500">*</span></label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          placeholder="Descripción detallada del servicio..."
          onChange={handleChange}
          minLength={20}
          maxLength={2000}
          className="w-full border rounded px-3 py-2"
          required
        />
        {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion}</span>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Dirección</label>
        <input
          name="direccion"
          type="text"
          value={form.direccion}
          placeholder="Calle Nr. 123"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          minLength={5}
          maxLength={255}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Ciudad <span className="text-red-500">*</span></label>
        <div className="relative">
          <input
            name="cityNombre"
            type="text"
            value={form.cityNombre}
            onChange={handleChange}
            onBlur={handleCiudadBlur}
            placeholder="Ciudad..."
            className="w-full border rounded px-3 py-2"
            autoComplete="off"
            required
          />
          {ciudadSugerencias.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 bg-white border rounded mt-1 shadow max-h-40 overflow-y-auto">
              {ciudadSugerencias.map(c => (
                <li
                  key={c.id}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                  onMouseDown={() => handleCiudadSelect(c)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Etiquetas (separadas por coma)</label>
        <input
          name="etiquetas"
          type="text"
          value={form.etiquetas}
          placeholder="Ej: etiqueta1, etiqueta2, etiqueta3"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          pattern="^([a-zA-Z0-9]+(, )?)*[a-zA-Z0-9]+$"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Email de contacto <span className="text-red-500">*</span></label>
        <input
          name="contacto_email"
          type="email"
          value={form.contacto_email}
          placeholder="usuario@ejemplo.com"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          required
        />
        {errors.contacto_email && <span className="text-red-500 text-sm">{errors.contacto_email}</span>}
      </div>

      <div>
        <label className="block font-semibold mb-1">WhatsApp de contacto</label>
        <input
          name="contacto_whatsapp"
          type="text"
          value={form.contacto_whatsapp}
          placeholder="+56912345678"
          pattern="^\+?[0-9]{1,3}?[0-9]{9}$"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          maxLength={12}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Teléfono de contacto</label>
        <input
          name="contacto_telefono"
          type="text"
          value={form.contacto_telefono}
          placeholder="+56912345678"
          pattern="^\+?[0-9]{1,3}?[0-9]{9}$"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          maxLength={12}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Enlace externo</label>
        <input
          name="enlace_externo"
          type="text"
          value={form.enlace_externo}
          placeholder="https://ejemplo.com"
          pattern="https?://.+"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Modalidad <span className="text-red-500">*</span></label>
        <select
          name="modalidad"
          value={form.modalidad}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Selecciona modalidad</option>
          {modalidades.map(m => (
            <option key={m} value={m}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
        {errors.modalidad && <span className="text-red-500 text-sm">{errors.modalidad}</span>}
      </div>

      <div>
        <label className="block font-semibold mb-1">Categoría <span className="text-red-500">*</span></label>
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Selecciona categoría</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {errors.categoria && <span className="text-red-500 text-sm">{errors.categoria}</span>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded font-semibold shadow hover:bg-blue-700 transition-all w-full mt-4"
      >
        {buttonText}
      </button>
    </form>
  );
}
