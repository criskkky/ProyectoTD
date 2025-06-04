import React from "react";
import { FaUserCircle, FaClipboardList, FaPlusCircle, FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const user = JSON.parse(sessionStorage.getItem('usuario')) || '';

// Simulación de datos
const servicios = [
  { id: 1, titulo: "Clases de Matemáticas", estado: "activo", fechapublicacion: "04-06-2025" },
  { id: 2, titulo: "Soporte Técnico PC", estado: "inactivo", fechapublicacion: "01-05-2025" },
  { id: 3, titulo: "Traducción Inglés-Español", estado: "bloqueado", fechapublicacion: "15-04-2025" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const publicaciones = servicios.length;
  const solicitudesRecibidas = 5;

  const perfil = {
    nombre: user.nombres || "Error",
    apellidos: user.apellidos || "Error",
    email: user.email || "Error"
  };

  // Handlers simulados
  const handleEditarServicio = (id) => {
    // Aquí iría la lógica real
    alert(`Editar servicio ${id}`);
  };
  const handleEliminarServicio = (id) => {
    // Aquí iría la lógica real
    alert(`Eliminar servicio ${id}`);
  };
  const handleEditarPerfil = () => {
    navigate("/perfil");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Panel de estadísticas */}
        <section className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex items-center gap-4">
            <FaClipboardList size={36} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">Publicaciones</h2>
              <p className="text-2xl font-bold">{publicaciones}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <FaEnvelope size={36} className="text-green-600" />
            <div>
              <h2 className="text-lg font-semibold">Solicitudes recibidas</h2>
              <p className="text-2xl font-bold">{solicitudesRecibidas}</p>
            </div>
          </div>
        </section>

        {/* Gestión de publicaciones */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Mis publicaciones</h2>
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => navigate("/publicar-servicio")}
            >
              <FaPlusCircle /> Crear publicación
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Título</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Fecha de publicación</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{servicio.titulo}</td>
                  <td className="py-2">{servicio.estado}</td>
                  <td className="py-2">{servicio.fechapublicacion}</td>
                  <td className="py-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      onClick={() => handleEditarServicio(servicio.id)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="text-red-600 hover:underline flex items-center gap-1"
                      onClick={() => handleEliminarServicio(servicio.id)}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Edición rápida de perfil */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <FaUserCircle size={40} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mi perfil</h2>
              <p className="text-gray-700">{perfil.nombre} {perfil.apellidos}</p>
              <p className="text-gray-500">{perfil.email}</p>
            </div>
          </div>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            onClick={handleEditarPerfil}
          >
            <FaEdit className="inline mr-2" /> Editar perfil
          </button>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
