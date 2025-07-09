import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicacionById } from "@/services/publi.service.js";

function ServicioDetalle() {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicacionById(id)
      .then((data) => {
        setServicio(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando servicio...</p>;
  if (!servicio) return <p>No se encontró el servicio.</p>;

  return (
    <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mt-10">
      <h1 className="text-2xl font-bold mb-4">{servicio.titulo}</h1>
      <p className="text-gray-600 mb-2">
        {servicio.categoria} • {servicio.modalidad}
      </p>
      <p className="mb-4">{servicio.descripcion}</p>
      <p className="text-gray-500 text-xs">Publicado: {servicio.createdAt}</p>
    </main>
  );
}

export default ServicioDetalle;