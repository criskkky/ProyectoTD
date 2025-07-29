import React, { useState, useEffect } from 'react';
import { fetchCiudades } from '../services/city.service';

export default function PubliForm({ initialData = {}, onSubmit, buttonText = "Guardar" }) {
    const [form, setForm] = useState({
        titulo: initialData.titulo || "",
        estado: initialData.estado || "activo",
        descripcion: initialData.descripcion || "",
        direccion: initialData.direccion || "",
        city: initialData.city || "",
        etiquetas: initialData.etiquetas || "",
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
            const todas = await fetchCiudades("");
            setCiudadesTodas(todas);
        }
        cargarCiudades();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === "city") {
            if (value.length > 1 && ciudadesTodas.length > 0) {
                setCiudadSugerencias(ciudadesTodas.filter(c => c.toLowerCase().includes(value.toLowerCase())));
            } else {
                setCiudadSugerencias([]);
            }
        }
    };
    const handleCiudadSelect = (ciudadSeleccionada) => {
        setForm(prev => ({ ...prev, city: ciudadSeleccionada }));
        setCiudadSugerencias([]);
    };
    const handleCiudadBlur = () => {
        if (form.city.length > 1 && ciudadSugerencias.length > 0) {
            setForm(prev => ({ ...prev, city: ciudadSugerencias[0] }));
            setCiudadSugerencias([]);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.titulo) newErrors.titulo = "El título es obligatorio";
        if (!form.descripcion) newErrors.descripcion = "La descripción es obligatoria";
        if (!form.city) newErrors.city = "La ciudad es obligatoria";
        if (!form.modalidad) newErrors.modalidad = "La modalidad es obligatoria";
        if (!form.categoria) newErrors.categoria = "La categoría es obligatoria";
        if (!form.contacto_email) newErrors.contacto_email = "El email es obligatorio";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(form);
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
                <label className="block font-semibold mb-1">Título *</label>
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
                <label className="block font-semibold mb-1">Estado *</label>
                <select name="estado" value={form.estado} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    {estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                </select>
            </div>
            <div>
                <label className="block font-semibold mb-1">Descripción *</label>
                <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Ciudad *</label>
                <div className="relative">
                    <input
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        onBlur={handleCiudadBlur}
                        placeholder="Ciudad..."
                        className="w-full border rounded px-3 py-2"
                        autoComplete="off"
                        required
                    />
                    {ciudadSugerencias.length > 0 && (
                        <ul className="absolute z-10 left-0 right-0 bg-white border rounded mt-1 shadow max-h-40 overflow-y-auto">
                            {ciudadSugerencias.map((c) => (
                                <li
                                    key={c}
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                                    onMouseDown={() => handleCiudadSelect(c)}
                                >
                                    {c}
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
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Email de contacto *</label>
                <input
                    name="contacto_email"
                    type="email"
                    value={form.contacto_email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
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
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Teléfono de contacto</label>
                <input
                    name="contacto_telefono"
                    type="text"
                    value={form.contacto_telefono}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Enlace externo</label>
                <input
                    name="enlace_externo"
                    type="text"
                    value={form.enlace_externo}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div>
                <label className="block font-semibold mb-1">Modalidad *</label>
                <select name="modalidad" value={form.modalidad} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Selecciona modalidad</option>
                    {modalidades.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                </select>
                {errors.modalidad && <span className="text-red-500 text-sm">{errors.modalidad}</span>}
            </div>
            <div>
                <label className="block font-semibold mb-1">Categoría *</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Selecciona categoría</option>
                    {categorias.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
                {errors.categoria && <span className="text-red-500 text-sm">{errors.categoria}</span>}
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold shadow hover:bg-blue-700 transition-all w-full mt-4">
                {buttonText}
            </button>
        </form>
    );
}
