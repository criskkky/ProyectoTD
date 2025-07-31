import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { fetchCities } from '../services/city.service';

export default function PubliForm({ initialData = {}, onSubmit, buttonText = "Guardar", userRole = "user" }) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      titulo: initialData.titulo || "",
      estado: initialData.estado || "activo",
      descripcion: initialData.descripcion || "",
      direccion: initialData.direccion || "",
      cityNombre: initialData.cityNombre || "",
      city: initialData.city || null,
      etiquetas: Array.isArray(initialData.etiquetas) ? initialData.etiquetas.join(", ") : (initialData.etiquetas || ""),
      contacto_email: initialData.contacto_email || "",
      contacto_whatsapp: initialData.contacto_whatsapp || "",
      contacto_telefono: initialData.contacto_telefono || "",
      enlace_externo: initialData.enlace_externo || "",
      modalidad: initialData.modalidad || "",
      categoria: initialData.categoria || "",
    }
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [ciudadesTodas, setCiudadesTodas] = useState([]);
  const [ciudadSugerencias, setCiudadSugerencias] = useState([]);

  useEffect(() => {
    async function cargarCiudades() {
      const todas = await fetchCities("");
      setCiudadesTodas(todas);
    }
    cargarCiudades();
  }, []);

  const cityNombre = watch("cityNombre");

  const handleCiudadChange = (e) => {
    const value = e.target.value;
    setValue("cityNombre", value, { shouldValidate: true });
    setValue("city", null, { shouldValidate: true });
    if (value.length > 1 && ciudadesTodas.length > 0) {
      const sugeridas = ciudadesTodas.filter(c =>
        c.name && c.name.toLowerCase().includes(value.toLowerCase())
      );
      setCiudadSugerencias(sugeridas);
    } else {
      setCiudadSugerencias([]);
    }
  };

  const handleCiudadSelect = (ciudadSeleccionada) => {
    setValue("city", ciudadSeleccionada.id, { shouldValidate: true });
    setValue("cityNombre", ciudadSeleccionada.name, { shouldValidate: true });
    setCiudadSugerencias([]);
  };

  const handleCiudadBlur = () => {
    if (cityNombre.length > 1 && ciudadSugerencias.length > 0) {
      const ciudad = ciudadSugerencias[0];
      if (ciudad && ciudad.name) {
        setValue("city", ciudad.id, { shouldValidate: true });
        setValue("cityNombre", ciudad.name, { shouldValidate: true });
      }
      setCiudadSugerencias([]);
    }
  };

  const onFormSubmit = (data) => {
    const { cityNombre, etiquetas, ...rest } = data;
    const dataToSend = {
      ...rest,
      etiquetas: etiquetas ? etiquetas.split(",").map(tag => tag.trim()).filter(tag => tag) : []
    };
    onSubmit(dataToSend);
  };

  const categorias = [
    { value: "arte", label: "Arte" },
    { value: "construcción", label: "Construcción" },
    { value: "educacion", label: "Educación" },
    { value: "salud", label: "Salud" },
    { value: "servicios generales", label: "Servicios generales" },
    { value: "tecnología", label: "Tecnología" }
  ];

  const modalidades = [
    { value: "presencial", label: "Presencial" },
    { value: "online", label: "Online" },
    { value: "mixta", label: "Mixta" }
  ];

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
    { value: "bloqueado", label: "Bloqueado" }
  ];

  // Filtra la opción "bloqueado" si el usuario no es admin
  const estadosFiltrados = userRole === "admin"
    ? estados
    : estados.filter(e => e.value !== "bloqueado");

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" autoComplete="off">
      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Título <span className="text-red-500">*</span></label>
        <input
          {...register("titulo", {
            required: "El título es obligatorio",
            minLength: { value: 3, message: "El título debe tener al menos 3 caracteres" },
            maxLength: { value: 255, message: "El título debe tener como máximo 255 caracteres" },
            validate: value => {
              if (/[0-9]/.test(value)) return "El título no puede contener números";
              if (/https?:\/\//.test(value) || /www\./.test(value)) return "El título no puede contener enlaces";
              if (/\b[a-zA-Z0-9._%+-]+\.(com|cl|net|org|info|es|co|edu|gov|mx|ar|pe|ec|uy|ve|br|fr|de|it|pt|ru|jp|cn|in)\b/.test(value)) return "El título no puede contener dominios";
              if (/[.]/.test(value)) return "El título no puede contener puntos";
              if (!/^([a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,;:¡!¿?\-_"()]+)$/.test(value)) return "El título solo puede contener texto";
              return true;
            }
          })}
          type="text"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.titulo?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Estado <span className="text-red-500">*</span></label>
        <select
          {...register("estado", {
            required: "El estado es obligatorio",
            validate: value => estadosFiltrados.map(e => e.value).includes(value) || "El estado debe ser válido"
          })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Selecciona estado</option>
          {estadosFiltrados.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.estado?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Descripción <span className="text-red-500">*</span></label>
        <textarea
          {...register("descripcion", {
            required: "La descripción es obligatoria",
            minLength: { value: 20, message: "La descripción debe tener al menos 20 caracteres" },
            maxLength: { value: 2000, message: "La descripción debe tener como máximo 2000 caracteres" },
            validate: value => {
              if (/[0-9]/.test(value)) return "La descripción no puede contener números";
              if (/https?:\/\//.test(value) || /www\./.test(value)) return "La descripción no puede contener enlaces";
              if (/\b[a-zA-Z0-9._%+-]+\.(com|cl|net|org|info|es|co|edu|gov|mx|ar|pe|ec|uy|ve|br|fr|de|it|pt|ru|jp|cn|in)\b/.test(value)) return "La descripción no puede contener dominios";
              if (!/^([a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,;:¡!¿?\-_'"()]+)$/.test(value)) return "La descripción solo puede contener palabras y signos de puntuación";
              return true;
            }
          })}
          placeholder="Descripción detallada del servicio..."
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.descripcion?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Dirección</label>
        <input
          {...register("direccion", {
            maxLength: { value: 255, message: "La dirección debe tener como máximo 255 caracteres" }
          })}
          type="text"
          placeholder="Calle Nr. 123"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.direccion?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1 relative">
        <label className="block font-semibold mb-1">Ciudad <span className="text-red-500">*</span></label>
        <input
          {...register("cityNombre", {
            required: "La ciudad es obligatoria",
            validate: {
              citySelected: () => watch("city") !== null || "Debe seleccionar una ciudad válida"
            }
          })}
          type="text"
          placeholder="Ciudad..."
          onChange={handleCiudadChange}
          onBlur={handleCiudadBlur}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="hidden"
          {...register("city", {
            required: "La ciudad es obligatoria",
            validate: value => value && !isNaN(value) && value > 0 || "La ciudad debe ser un ID válido"
          })}
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
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.cityNombre?.message || errors.city?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Etiquetas (separadas por coma)</label>
        <input
          {...register("etiquetas", {
            validate: {
              maxTags: value => {
                const tagsArray = value ? value.split(",").map(tag => tag.trim()).filter(tag => tag) : [];
                return tagsArray.length <= 3 || "Máximo 3 etiquetas permitidas";
              },
              maxLength: value => {
                const tagsArray = value ? value.split(",").map(tag => tag.trim()).filter(tag => tag) : [];
                return !tagsArray.some(tag => tag.length > 30) || "Cada etiqueta debe tener máximo 30 caracteres";
              }
            }
          })}
          type="text"
          placeholder="Ej: etiqueta1, etiqueta2, etiqueta3"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.etiquetas?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Email de contacto <span className="text-red-500">*</span></label>
        <input
          {...register("contacto_email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "El email de contacto debe ser válido"
            }
          })}
          type="email"
          placeholder="usuario@ejemplo.com"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.contacto_email?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">WhatsApp de contacto</label>
        <input
          {...register("contacto_whatsapp", {
            maxLength: { value: 12, message: "El WhatsApp debe tener como máximo 12 caracteres" }
          })}
          type="text"
          placeholder="+56912345678"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.contacto_whatsapp?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Teléfono de contacto</label>
        <input
          {...register("contacto_telefono", {
            maxLength: { value: 12, message: "El teléfono debe tener como máximo 12 caracteres" }
          })}
          type="text"
          placeholder="+56912345678"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.contacto_telefono?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Enlace externo</label>
        <input
          {...register("enlace_externo", {
            validate: value => {
              if (!value) return true;
              try {
                new URL(value);
                return true;
              } catch {
                return "El enlace externo debe ser una URL válida";
              }
            }
          })}
          type="text"
          placeholder="https://ejemplo.com"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.enlace_externo?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Modalidad <span className="text-red-500">*</span></label>
        <select
          {...register("modalidad", {
            required: "La modalidad es obligatoria",
            validate: value => ["presencial", "online", "mixta"].includes(value) || "La modalidad debe ser presencial, online o mixta"
          })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Selecciona modalidad</option>
          {modalidades.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.modalidad?.message || ""}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="block font-semibold mb-1">Categoría <span className="text-red-500">*</span></label>
        <select
          {...register("categoria", {
            required: "La categoría es obligatoria",
            validate: value => [
              "arte",
              "construcción",
              "educacion",
              "salud",
              "servicios generales",
              "tecnología"
            ].includes(value) || "La categoría debe ser una de las permitidas"
          })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Selecciona categoría</option>
          {categorias.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <div className="text-red-500 text-sm min-h-[1.5em]">
          {errors.categoria?.message || ""}
        </div>
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