import React, { useEffect } from "react";
import usePublications from "../hooks/publications/usePublications";

function Explore() {
  const { publicaciones, loading, fetchPublicaciones } = usePublications();

  useEffect(() => {
    fetchPublicaciones(); // Llama a fetchPublicaciones sin userId para obtener todas las publicaciones
  }, [fetchPublicaciones]);

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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicaciones.map((servicio) => (
                <div
                  key={servicio.id}
                  className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-lg">{servicio.titulo}</h3>
                  <p className="text-gray-600">{servicio.descripcion}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Explore;
