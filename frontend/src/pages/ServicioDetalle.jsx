import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicacionById } from "@/services/publi.service.js";
import { FaExclamationTriangle, FaClipboardList, FaMapMarkerAlt, FaUser, FaEnvelope, FaWhatsapp, FaPhone, FaTag, FaExternalLinkAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext.jsx";
import { getFirstNameLastName } from "@/helpers/formatData.js";

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
  const BlurInfo = ({ label, icon: Icon }) => (
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <span className="font-semibold text-gray-700">{label}:</span>
      </div>
      <span className="blur-sm bg-gray-100 px-2 rounded text-gray-400 inline-block">No disponible</span>
    </div>
  );

  const handleExternalClick = (url) => {
    setExternalUrl(url);
    setShowExternalModal(true);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Cabecera principal */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold mb-2">
              <FaClipboardList className="text-blue-500" size={18} />
              Detalle del servicio
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{servicio.titulo}</h1>
            {servicio.createdBy && (
              <p className="text-gray-700 text-base mb-4 flex flex-wrap items-center gap-2">
                <span className="bg-gray-100 text-blue-700 p-2 rounded font-semibold text-xs flex items-center gap-2">
                  <FaUser className="text-blue-500 w-4 h-4" />
                  Publicado por: {getFirstNameLastName(servicio.createdBy)}
                </span>
                <span className="bg-blue-50 text-blue-700 p-2 rounded font-semibold text-xs">{servicio.categoria}</span>
                <span className="border border-green-200 text-green-700 p-2 rounded text-xs">{servicio.modalidad}</span>
              </p>
            )}
            <p className="mb-4 text-gray-700 text-base leading-relaxed">{servicio.descripcion}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                <span>Ciudad: {servicio.city || "No disponible"}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                <span>Región: {servicio.region || "No disponible"}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaExclamationTriangle className="w-4 h-4 text-blue-600" />
                <span>Publicado: {servicio.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Advertencia de autenticación */}
          {!isAuthenticated && (
            <div className="mt-4 mb-8 w-full flex">
              <span className="justify-center inline-flex items-center w-full bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold text-sm shadow">
                <FaExclamationTriangle className="mr-2 text-yellow-500" size={18} />
                Inicia sesión para ver los detalles completos
              </span>
            </div>
          )}

          {/* Detalles en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Columna 1: Contacto */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <FaUser className="w-6 h-6 text-blue-600" />
                Contacto
              </h3>
            <BlurInfo label="Email de contacto" icon={FaEnvelope}>
              {isAuthenticated ? (servicio.contacto_email || "No disponible") : null}
            </BlurInfo>
            <BlurInfo label="WhatsApp" icon={FaWhatsapp}>
              {isAuthenticated ? (servicio.contacto_whatsapp || "No disponible") : null}
            </BlurInfo>
            <BlurInfo label="Teléfono" icon={FaPhone}>
              {isAuthenticated ? (servicio.contacto_telefono || "No disponible") : null}
            </BlurInfo>
            </div>

            {/* Columna 2: Otros detalles */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <FaClipboardList className="w-6 h-6 text-blue-600" />
                Detalles Adicionales
              </h3>
              <BlurInfo label="Dirección" icon={FaMapMarkerAlt}>
                {isAuthenticated ? (servicio.direccion || "No disponible") : null}
              </BlurInfo>
              <BlurInfo label="Etiquetas" icon={FaTag}>
                {isAuthenticated ? (
                  servicio.etiquetas && servicio.etiquetas.length ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {servicio.etiquetas.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                  ) : "No disponible"
                ) : null}
              </BlurInfo>
              <BlurInfo label="Enlace externo" icon={FaExternalLinkAlt}>
                {isAuthenticated && servicio.enlace_externo && servicio.enlace_externo !== "No disponible" ? (
                  <button
                    className="text-blue-600 underline hover:text-blue-800 font-semibold"
                    onClick={() => handleExternalClick(servicio.enlace_externo)}
                  >
                    {servicio.enlace_externo}
                  </button>
                ) : null}
              </BlurInfo>
            </div>
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
        </div>
      </div>
    </div>
  );
}

export default ServicioDetalle;