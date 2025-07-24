import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicacionById } from "@/services/publi.service.js";
import { FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext.jsx";

function ServicioDetalle() {
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
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

  useEffect(() => {
    if (showExternalModal) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showExternalModal]);

  if (loading) return <p>Cargando servicio...</p>;
  if (!servicio) return <p>No se encontró el servicio.</p>;

  // Helper para mostrar blur si no está logueado
  const BlurInfo = ({ label }) => (
    <div className="mb-2">
      <span className="font-semibold">{label}: </span>
      <span className="blur-sm bg-gray-100 px-2 rounded text-gray-400">No disponible</span>
    </div>
  );

  const handleExternalClick = (url) => {
    setExternalUrl(url);
    setShowExternalModal(true);
  };

  const camposExtra = [
    { key: "direccion", label: "Dirección" },
    { key: "city", label: "Ciudad" },
    { key: "region", label: "Región" },
    { key: "etiquetas", label: "Etiquetas", render: v => v && v.length ? v.join(", ") : "No disponible" },
    { key: "contacto_email", label: "Email de contacto" },
    { key: "contacto_whatsapp", label: "WhatsApp" },
    { key: "contacto_telefono", label: "Teléfono" },
    {
      key: "enlace_externo",
      label: "Enlace externo",
      render: v => v && v !== "No disponible" ? (
        <button
          className="text-blue-600 underline hover:text-blue-800 font-semibold"
          onClick={() => handleExternalClick(v)}
        >
          {v}
        </button>
      ) : "No disponible"
    },
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
          {/* Modal de advertencia para enlaces externos */}
          {showExternalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <FaExclamationTriangle className="mx-auto text-yellow-500 mb-4" size={40} />
                <h2 className="text-xl font-bold mb-2 text-gray-900">Vas a salir de la plataforma</h2>
                <p className="text-gray-700 mb-6">Estás a punto de abrir un enlace externo:<br /><span className="break-all text-blue-600">{externalUrl}</span><br />¿Deseas continuar?</p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                    onClick={() => setShowExternalModal(false)}
                  >Cancelar</button>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    onClick={() => setShowExternalModal(false)}
                  >Abrir enlace</a>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ServicioDetalle;