import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePublications from "../hooks/publications/usePublications";

function Explore() {
  const navigate = useNavigate();
  const { publicaciones, loading, fetchPublicaciones } = usePublications();

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones]);

  const handleServicioClick = (e, id) => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario) {
      e.preventDefault();
      navigate("/auth");
    }
  };

  return (
    <main className="min-h-screen py-10 px-4 md:px-0">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Search Bar */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Explorar Servicios</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Buscar servicios..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Buscar
            </button>
          </div>
        </section>

        {/* Mostrar servicios obtenidos del backend */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Publicaciones Disponibles</h2>
          {loading ? (
            <p>Cargando publicaciones...</p>
          ) : publicaciones.length === 0 ? (
            <p>No hay publicaciones disponibles en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicaciones.map((servicio) => (
                <Link
                  key={servicio.id}
                  to={`/servicio/${servicio.id}`}
                  className="bg-white p-6 rounded-xl shadow-md border border-blue-500 block hover:shadow-lg transition"
                  onClick={(e) => handleServicioClick(e, servicio.id)}
                >
                  <h3 className="font-bold text-xl mb-2">{servicio.titulo}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {servicio.categoria} • {servicio.modalidad}
                  </p>
                  <p className="text-gray-700">{servicio.descripcion}</p>
                  <p className="text-gray-500 text-xs mt-4">{servicio.createdAt}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Explore;
