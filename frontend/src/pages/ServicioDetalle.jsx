import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicacionById } from "@/services/publi.service.js";
import { FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
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
    { key: "city", label: "Ciudad" }, // Muestra el string tal cual
    { key: "region", label: "Región" }, // Muestra el string tal cual
    { key: "etiquetas", label: "Etiquetas", render: v => v && v.length ? v.join(", ") : "No disponible" }, // Muestra etiquetas separadas por coma
    { key: "contacto_email", label: "Email de contacto" },
    { key: "contacto_whatsapp", label: "WhatsApp" },
    { key: "contacto_telefono", label: "Teléfono" },
    { key: "enlace_externo", label: "Enlace externo" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold mb-2">
              <FaClipboardList className="text-blue-500" size={18} />
              Detalle del servicio
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{servicio.titulo}</h1>
            <p className="text-gray-600 text-lg mb-2">
              <span className="font-semibold">{servicio.categoria}</span> • {servicio.modalidad}
            </p>
            <p className="mb-4 text-gray-700 text-base leading-relaxed">{servicio.descripcion}</p>
            <p className="text-gray-500 text-xs">Publicado: {servicio.createdAt}</p>
            {!isAuthenticated && (
              <div className="mt-4 w-full flex">
                <span className="justify-center inline-flex items-center w-full bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold text-sm shadow">
                  <FaExclamationTriangle className="mr-2 text-yellow-500" size={18} />
                  Inicia sesión para ver los detalles completos
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {camposExtra.map(({ key, label, render }) => (
              isAuthenticated ? (
                <div className="mb-2" key={key}>
                  <span className="font-semibold text-blue-700">{label}: </span>
                  <span>{render ? render(servicio[key]) : servicio[key] || "No disponible"}</span>
                </div>
              ) : (
                <BlurInfo key={key} label={label} />
              )
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ServicioDetalle;