import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicacionById } from "@/services/publi.service.js";
import { useAuth } from "@/context/AuthContext.jsx";

function ServicioDetalle() {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setLoading(true);
    getPublicacionById(id)
      .then((data) => {
        setServicio(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isAuthenticated]);

  if (loading) return <p>Cargando servicio...</p>;
  if (!servicio) return <p>No se encontró el servicio.</p>;

  // Helper para mostrar blur si no está logueado
  const BlurInfo = ({ label }) => (
    <div className="mb-2">
      <span className="font-semibold">{label}: </span>
      <span className="blur-sm bg-gray-100 px-2 rounded text-gray-400">No disponible</span>
      <span className="ml-2 text-xs text-blue-500">(Inicia sesión para ver)</span>
    </div>
  );

  // Campos que no están en el render actual
  const camposExtra = [
    // 'render' permite personalizar cómo se muestra el valor del campo en el detalle.
    // Recibe el valor (v) y retorna el string a mostrar.
    { key: "imagenes", label: "Imágenes", render: v => v && v.length ? (
      <div className="flex flex-wrap gap-2">
        {v.map((url, idx) => (
          <img key={idx} src={url} alt={`Imagen ${idx + 1}`} className="w-24 h-24 object-cover rounded shadow" />
        ))}
      </div>
    ) : "No disponible" }, // Renderiza una galería de imágenes
    { key: "direccion", label: "Dirección" }, // Muestra el string tal cual
    { key: "city", label: "Ciudad", render: v => v?.name ?? "No disponible" }, // Muestra el nombre de la ciudad
    { key: "region", label: "Región", render: v => v?.region?.name ?? (v?.city?.region?.name ?? "No disponible") }, // Muestra el nombre de la región asociada
    { key: "etiquetas", label: "Etiquetas", render: v => v && v.length ? v.join(", ") : "No disponible" }, // Muestra etiquetas separadas por coma
    { key: "contacto_email", label: "Email de contacto" },
    { key: "contacto_whatsapp", label: "WhatsApp" },
    { key: "contacto_telefono", label: "Teléfono" },
    { key: "enlace_externo", label: "Enlace externo" },
  ];

  return (
    <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-10">
      <h1 className="text-2xl font-bold mb-4">{servicio.titulo}</h1>
      <p className="text-gray-600 mb-2">
        {servicio.categoria} • {servicio.modalidad}
      </p>
      <p className="mb-4">{servicio.descripcion}</p>
      <p className="text-gray-500 text-xs">Publicado: {servicio.createdAt}</p>

      {/* Renderizar campos extra con blur si no está logueado */}
      {camposExtra.map(({ key, label, render }) => (
        isAuthenticated ? (
          <div className="mb-2" key={key}>
            <span className="font-semibold">{label}: </span>
            <span>{render ? render(servicio[key]) : servicio[key] || "No disponible"}</span>
          </div>
        ) : (
          <BlurInfo key={key} label={label} />
        )
      ))}
    </main>
  );
}

export default ServicioDetalle;